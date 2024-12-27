import { Container, HStack, SimpleGrid, Stack } from "@chakra-ui/react";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { DateTime } from "luxon";
import { authenticator } from "~/.server/auth.server";
import { ButtonLink } from "~/components/button-link";
import { db } from "~/db.server";
import { CalendarDocument } from "~/graphql/generated/documents";
import { gql } from "~/graphql/graphql.server";
import { getTimeZoneFromRequest } from "~/time";
import { Day } from "./day";
import { FogisSyncAlert } from "./fogis-sync-alert";
import { OnboardingAlert } from "./onboarding-alert";

export async function loader({ request }: LoaderFunctionArgs) {
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  });
  const timeZone = getTimeZoneFromRequest(request);
  const now = DateTime.now().setZone(timeZone);

  const { data } = await gql({
    document: CalendarDocument,
    variables: {
      after: now
        .startOf("week")
        .minus({ weeks: 2, days: 1 })
        .toFormat("yyyy-MM-dd"),
      before: now
        .endOf("week")
        .plus({ weeks: 2, days: 1 })
        .toFormat("yyyy-MM-dd"),
    },
    request,
  });

  const realUser = await db.user.findUniqueOrThrow({ where: { id: user.id } });
  const purposes = await db.activityPurpose.findMany({});

  return json({
    data,
    purposes,
    timeZone,
    showOnboarding: !realUser.onboardedAt,
    showFogisSync:
      realUser.lastFogisSync &&
      DateTime.fromJSDate(realUser.lastFogisSync).diffNow().as("weeks") < -1,
  });
}

export default function DashboardIndex() {
  const { timeZone, showOnboarding, showFogisSync, data } =
    useLoaderData<typeof loader>();

  const now = DateTime.now().setZone(timeZone);

  return (
    <Container maxW="container.lg" py={5}>
      <Stack spacing={5}>
        {showOnboarding ? <OnboardingAlert /> : null}

        {showFogisSync ? <FogisSyncAlert /> : null}

        <HStack>
          <div>
            <ButtonLink to={`/calendar`} variant="secondary">
              +/- 2 veckor
            </ButtonLink>
          </div>
          <div>
            <ButtonLink to={`/months/${now.toFormat("yyyy'/'MM")}`}>
              Månadsvy
            </ButtonLink>
          </div>
        </HStack>

        <SimpleGrid columns={7} rowGap={2} columnGap={1}>
          {data?.days.edges?.map((day) =>
            day.node ? <Day key={day.cursor} day={day.node} /> : null
          )}
        </SimpleGrid>
      </Stack>
    </Container>
  );
}
