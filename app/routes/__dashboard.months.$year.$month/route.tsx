import {
  Container,
  HStack,
  Heading,
  SimpleGrid,
  Spacer,
  Stack,
  Wrap,
} from "@chakra-ui/react";
import {
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { DateTime, Interval } from "luxon";
import { z } from "zod";
import { authenticator } from "~/.server/auth.server";
import { ButtonLink } from "~/components/button-link";
import { IconButtonLink } from "~/components/icon-button-link";
import { db } from "~/db.server";
import { CalendarDocument } from "~/graphql/generated/documents";
import { gql } from "~/graphql/graphql.server";
import { getTimeZoneFromRequest } from "~/time";
import { Day } from "../__dashboard.calendar/day";

const paramsType = z.object({ year: z.string(), month: z.string() });

export async function loader({ request, params }: LoaderFunctionArgs) {
  await authenticator.isAuthenticated(request, { failureRedirect: "/login" });
  const timeZone = getTimeZoneFromRequest(request);

  const { year, month } = paramsType.parse(params);

  const monthStart = DateTime.fromFormat(`${year}-${month}`, "yyyy-MM", {
    zone: timeZone,
  }).startOf("month");

  const { data } = await gql({
    document: CalendarDocument,
    variables: {
      after: monthStart
        .startOf("week")
        .minus({ days: 1 })
        .toFormat("yyyy-MM-dd"),
      before: monthStart
        .endOf("month")
        .endOf("week")
        .plus({ days: 1 })
        .toFormat("yyyy-MM-dd"),
    },
    request,
  });

  const purposes = await db.activityPurpose.findMany({});

  return json({
    data,
    purposes,
    timeZone,
    start: monthStart,
    end: monthStart.endOf("month"),
  });
}

export default function DashboardIndex() {
  const { data, start, end, timeZone } = useLoaderData<typeof loader>();
  const month = Interval.fromDateTimes(
    DateTime.fromISO(start!, { zone: timeZone }),
    DateTime.fromISO(end!, { zone: timeZone })
  );
  const previousMonth = month.start!.minus({ months: 1 });
  const nextMonth = month.start!.plus({ months: 1 });
  const now = DateTime.now().setZone(timeZone);

  return (
    <Container maxW="container.lg" py={5}>
      <Stack spacing={5}>
        <Wrap>
          <HStack>
            <Spacer />
            <div>
              <ButtonLink to={`/calendar`}>+/- 2 veckor</ButtonLink>
            </div>
            <div>
              <ButtonLink
                to={`/months/${now.toFormat("yyyy'/'MM")}`}
                variant="secondary"
              >
                Månadsvy
              </ButtonLink>
            </div>
          </HStack>

          <HStack flex={1}>
            <div>
              <IconButtonLink
                to={`/months/${previousMonth.toFormat("yyyy'/'MM")}`}
                aria-label={previousMonth.toFormat("LLLL yyyy", {
                  locale: "sv-SE",
                })}
              >
                <FontAwesomeIcon icon={faChevronLeft} />
              </IconButtonLink>
            </div>
            <Spacer />
            <Heading as="h1" size="sm" textTransform="capitalize">
              {month.start!.toFormat("LLLL yyyy", { locale: "sv-SE" })}
            </Heading>
            <Spacer />
            <div>
              <IconButtonLink
                to={`/months/${nextMonth.toFormat("yyyy'/'MM")}`}
                aria-label={nextMonth.toFormat("LLLL yyyy", {
                  locale: "sv-SE",
                })}
              >
                <FontAwesomeIcon icon={faChevronRight} />
              </IconButtonLink>
            </div>
          </HStack>
        </Wrap>

        <SimpleGrid columns={7} rowGap={2} columnGap={1}>
          {data?.days.edges?.map((day) =>
            day.node ? (
              <Day
                key={day.cursor}
                day={day.node}
                opacity={
                  month.contains(
                    DateTime.fromISO(day.node.start, { zone: timeZone })
                  )
                    ? undefined
                    : 0.4
                }
              />
            ) : null
          )}
        </SimpleGrid>
      </Stack>
    </Container>
  );
}
