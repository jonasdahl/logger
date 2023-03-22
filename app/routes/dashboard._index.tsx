import { Box, Center, Container, SimpleGrid, Stack } from "@chakra-ui/react";
import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { DateTime, Interval } from "luxon";
import { FogisClient } from "~/fogis/client";
import { getSessionFromRequest } from "~/session.server";

export async function loader({ request }: LoaderArgs) {
  const data = await getSessionFromRequest(request);

  const fogisClient = new FogisClient({
    auth: { username: "jonas.dahl.1", password: "trustno1" },
  });
  await fogisClient.login();
  const games = await fogisClient.getGames();

  return json(
    {
      polarAccessToken: data.get("polarAccessToken"),
      polarUserId: data.get("polarUserId"),
      games,
    },
    { headers: { "Cache-Control": "public, max-age=600" } }
  );
}

export default function DashboardIndex() {
  const { games } = useLoaderData<typeof loader>();
  const now = DateTime.now();
  const startOfWeek = now.startOf("week");
  const startOfPreviousWeek = startOfWeek.minus({ weeks: 2 });
  const endOfWeek = now.endOf("week");
  const endOfPeriod = endOfWeek.plus({ weeks: 1 });
  const interval = Interval.fromDateTimes(startOfPreviousWeek, endOfPeriod);
  const days = interval.splitBy({ days: 1 });

  return (
    <Container maxW="container.lg" py={5}>
      <SimpleGrid columns={7} gap={2}>
        {days.map((day) => {
          const dayGames = games.filter((g) =>
            day.contains(DateTime.fromISO(g.time))
          );
          const hasGame = !!dayGames.length;
          const hasExercise = true;
          const isRest = !hasGame && !hasExercise;

          return (
            <Box key={day.start.toMillis()} h="7rem">
              <Stack h="100%" spacing={0}>
                <Box fontSize="xs" textAlign="center" fontWeight="bold">
                  {day.start.toFormat("yyyy-MM-dd")}
                </Box>
                <Center
                  bg={hasGame ? "red.500" : isRest ? "green.500" : "blue.700"}
                  borderRadius="xl"
                  flexGrow={1}
                  opacity={day.start.diffNow().toMillis() > 0 ? 0.5 : undefined}
                  borderWidth={day.contains(DateTime.now()) ? 5 : 0}
                  borderColor={"blue.800"}
                  color="white"
                >
                  {hasGame ? "Match" : null}
                </Center>
              </Stack>
            </Box>
          );
        })}
      </SimpleGrid>
    </Container>
  );
}
