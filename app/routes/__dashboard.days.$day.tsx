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
import { z } from "zod";
import { authenticator } from "~/auth.server";
import { ButtonLink } from "~/components/button-link";
import { Link } from "~/components/link";
import { db } from "~/db.server";

const dayType = z
  .string()
  .transform((s) => DateTime.fromFormat(s, "yyyy-MM-dd"));
const paramsType = z.object({ day: dayType });

export async function loader({ request, params }: LoaderArgs) {
  const { day } = paramsType.parse(params);
  const { id } = await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  });

  const user = await db.user.findFirstOrThrow({
    where: { id },
    include: {
      polarExercises: {
        where: {
          startTime: {
            gte: day.startOf("day").toJSDate(),
            lte: day.endOf("day").toJSDate(),
          },
        },
        orderBy: { startTime: "asc" },
      },
      activities: {
        where: {
          time: {
            gte: day.startOf("day").toJSDate(),
            lte: day.endOf("day").toJSDate(),
          },
          deletedAt: null,
        },
        include: { primaryPurpose: {}, secondaryPurpose: {} },
        orderBy: { time: "asc" },
      },
    },
  });

  return json({
    dayString: day.toFormat("yyyy-MM-dd"),
    polarEntries: user.polarExercises,
    activities: user.activities,
  });
}

export default function DashboardIndex() {
  const { dayString, polarEntries, activities } =
    useLoaderData<typeof loader>();
  const day = dayType.parse(dayString);
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

        <Heading size="sm">Aktiviteter</Heading>
        {activities.map((e) => (
          <Box key={e.id} bg="blue.50" borderRadius="md" padding={3}>
            <Wrap spacing={3}>
              <Box as="time">{DateTime.fromISO(e.time).toFormat("HH:mm")}</Box>
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
    </Container>
  );
}
