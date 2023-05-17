import {
  Box,
  Container,
  HStack,
  Heading,
  ListItem,
  Spacer,
  Stack,
  UnorderedList,
  VStack,
  Wrap,
} from "@chakra-ui/react";
import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { DateTime } from "luxon";
import { authenticator } from "~/auth.server";
import { ButtonLink } from "~/components/button-link";
import { Link } from "~/components/link";
import { db } from "~/db.server";
import { getTimeZoneFromRequest } from "~/time";

export async function loader({ request, params }: LoaderArgs) {
  const { id } = await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  });
  const timeZone = getTimeZoneFromRequest(request);
  if (!params.day) {
    throw new Error("No day param");
  }
  const day = DateTime.fromFormat(params.day, "yyyy-MM-dd", { zone: timeZone });
  const dayStart = day.startOf("day");
  const dayEnd = day.endOf("day");

  const timeFilter = { gte: dayStart.toJSDate(), lte: dayEnd.toJSDate() };

  const user = await db.user.findFirstOrThrow({
    where: { id },
    include: {
      polarExercises: {
        where: { startTime: timeFilter },
        orderBy: { startTime: "asc" },
      },
      activities: {
        where: { time: timeFilter, deletedAt: null },
        include: { primaryPurpose: {}, secondaryPurpose: {} },
        orderBy: { time: "asc" },
      },
      plannedActivities: {
        where: { time: timeFilter, deletedAt: null },
        include: { primaryPurpose: {}, secondaryPurpose: {} },
        orderBy: { time: "asc" },
      },
    },
  });

  return json({
    dayStart: dayStart.toISO(),
    dayEnd: dayEnd.toISO(),
    timeZone,
    polarEntries: user.polarExercises,
    activities: user.activities,
    plannedActivities: user.plannedActivities,
  });
}

export default function DashboardIndex() {
  const { dayStart, timeZone, polarEntries, activities, plannedActivities } =
    useLoaderData<typeof loader>();

  const day = DateTime.fromISO(dayStart, { zone: timeZone });
  const dayBefore = day.minus({ days: 1 });
  const dayAfter = day.plus({ days: 1 });

  return (
    <Container py={5} maxW="container.md">
      <Stack>
        <HStack>
          <Spacer />
          <ButtonLink
            to={`/activities/create?date=${day.toFormat("yyyy-MM-dd")}`}
            colorScheme="green"
          >
            Ny aktivitet
          </ButtonLink>
        </HStack>
        <HStack>
          <ButtonLink to={`/days/${dayBefore.toFormat("yyyy-MM-dd")}`}>
            {dayBefore.toFormat("yyyy-MM-dd")}
          </ButtonLink>
          <Spacer />
          <VStack textAlign="center">
            <Heading>{day.toFormat("yyyy-MM-dd")}</Heading>
            <Box>{day.toFormat("EEEE 'vecka' WW, kkkk", { locale: "sv" })}</Box>
          </VStack>
          <Spacer />
          <ButtonLink to={`/days/${dayAfter.toFormat("yyyy-MM-dd")}`}>
            {dayAfter.toFormat("yyyy-MM-dd")}
          </ButtonLink>
        </HStack>

        {activities.length ? (
          <Stack>
            <Heading size="sm">Aktiviteter</Heading>
            {activities.map((e) => (
              <Box key={e.id} bg="blue.50" borderRadius="md" padding={3}>
                <Wrap spacing={3}>
                  <Box as="time">
                    {DateTime.fromISO(e.time, { zone: timeZone }).toFormat(
                      "HH:mm"
                    )}
                  </Box>
                  {e.primaryPurpose ? (
                    <Box>Primärt: {e.primaryPurpose.label}</Box>
                  ) : null}
                  {e.secondaryPurpose ? (
                    <Box>Sekundärt: {e.secondaryPurpose.label}</Box>
                  ) : null}
                  {e.description ? <Box>{e.description}</Box> : null}
                  {e.comment ? <Box>{e.comment}</Box> : null}
                </Wrap>
              </Box>
            ))}
          </Stack>
        ) : null}

        {polarEntries.length ? (
          <Stack>
            <Heading size="sm">Data från Polar</Heading>
            <UnorderedList pl={4}>
              {polarEntries.map((e) => (
                <ListItem key={e.id}>
                  <Link to={`/connections/polar/exercise/${e.id}`}>
                    {e.startTime}
                  </Link>
                </ListItem>
              ))}
            </UnorderedList>
          </Stack>
        ) : null}

        {plannedActivities.length ? (
          <Stack>
            <Heading size="sm">Planerade aktiviteter</Heading>
            {plannedActivities.map((e) => (
              <Box key={e.id} bg="blue.50" borderRadius="md" padding={3}>
                <Wrap spacing={3}>
                  <Box as="time">
                    {DateTime.fromISO(e.time, { zone: timeZone }).toFormat(
                      "HH:mm"
                    )}
                  </Box>
                  {e.primaryPurpose ? (
                    <Box>Primärt: {e.primaryPurpose.label}</Box>
                  ) : null}
                  {e.secondaryPurpose ? (
                    <Box>Sekundärt: {e.secondaryPurpose.label}</Box>
                  ) : null}
                  {e.description ? <Box>{e.description}</Box> : null}
                  {e.comment ? <Box>{e.comment}</Box> : null}
                </Wrap>
              </Box>
            ))}
          </Stack>
        ) : null}
      </Stack>
    </Container>
  );
}
