import {
  Box,
  Container,
  Heading,
  Spacer,
  Stack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Table,
  Tabs,
  Tbody,
  Td,
  Tooltip,
  Tr,
  Wrap,
  WrapItem,
} from "@chakra-ui/react";
import type { LoaderFunctionArgs, SerializeFrom } from "@remix-run/node";
import { json } from "@remix-run/node";
import { authenticator } from "~/.server/auth.server";
import { HiddenReturnToInput } from "~/services/return-to";

import { useLoaderData } from "@remix-run/react";
import { DateTime, Duration } from "luxon";
import { z } from "zod";
import { ButtonLink } from "~/components/button-link";
import {
  AnimatedAxis,
  AnimatedGrid,
  AnimatedLineSeries,
  XYChart,
} from "~/components/charts/xy-chart.client";
import { ClientOnly } from "~/components/client-only";
import { GameDocument } from "~/graphql/generated/documents";
import { gql } from "~/graphql/graphql.server";

export async function loader({ request, params }: LoaderFunctionArgs) {
  await authenticator.isAuthenticated(request, { failureRedirect: "/" });
  const { gameId } = z.object({ gameId: z.string() }).parse(params);

  const res = await gql({
    document: GameDocument,
    request,
    variables: { gameId },
  });

  return json(res.data);
}

export default function Game() {
  const data = useLoaderData<typeof loader>();
  const start = data?.game?.start;
  const now = DateTime.now();
  const isStarted = start ? DateTime.fromISO(start) < now : false;

  return (
    <Container py={5} maxW="container.md">
      <HiddenReturnToInput />
      <Stack spacing={5}>
        <Wrap align="center">
          <WrapItem>
            <Heading as="h1">Match</Heading>
          </WrapItem>
          <Spacer />
          {start ? (
            <WrapItem>
              <ButtonLink
                variant="link"
                to={`/days/${DateTime.fromISO(start).toFormat("yyyy-MM-dd")}`}
              >
                Visa dag
              </ButtonLink>
            </WrapItem>
          ) : null}
        </Wrap>

        <Tabs>
          <TabList>
            {isStarted ? <Tab>Översikt</Tab> : null}
            {isStarted ? <Tab>Tidslinje</Tab> : null}
            <Tab>Packlista</Tab>
            <Tab>Resa</Tab>
          </TabList>
          <TabPanels>
            {isStarted ? (
              <TabPanel px={0}>
                <Overview data={data} />
              </TabPanel>
            ) : null}
            {isStarted ? (
              <TabPanel px={0}>
                <TimeLine data={data} />
              </TabPanel>
            ) : null}
            <TabPanel px={0}>TBD</TabPanel>
            <TabPanel px={0}>TBD</TabPanel>
          </TabPanels>
        </Tabs>
      </Stack>
    </Container>
  );
}

function Overview({ data }: { data: SerializeFrom<typeof loader> }) {
  const totalTime = data?.game?.startDay.heartRateSummary;
  return (
    <Box>
      <Table size="sm">
        <Tbody>
          <Tr>
            <Td>Tid i zon 5:</Td>
            <Td textAlign="right">
              {Duration.fromMillis((totalTime?.zone5 ?? 0) * 1000)
                .shiftTo("minutes", "seconds")
                .toFormat("m'min' ss's'")}
            </Td>
          </Tr>
          <Tr>
            <Td>Tid i zon 4:</Td>
            <Td textAlign="right">
              {Duration.fromMillis((totalTime?.zone4 ?? 0) * 1000)
                .shiftTo("minutes", "seconds")
                .toFormat("m'min' ss's'")}
            </Td>
          </Tr>
          <Tr>
            <Td>Tid i zon 3:</Td>
            <Td textAlign="right">
              {Duration.fromMillis((totalTime?.zone3 ?? 0) * 1000)
                .shiftTo("minutes", "seconds")
                .toFormat("m'min' ss's'")}
            </Td>
          </Tr>
          <Tr>
            <Td>Tid i zon 2:</Td>
            <Td textAlign="right">
              {Duration.fromMillis((totalTime?.zone2 ?? 0) * 1000)
                .shiftTo("minutes", "seconds")
                .toFormat("m'min' ss's'")}
            </Td>
          </Tr>
          <Tr>
            <Td>Tid i zon 1:</Td>
            <Td textAlign="right">
              {Duration.fromMillis((totalTime?.zone1 ?? 0) * 1000)
                .shiftTo("minutes", "seconds")
                .toFormat("m'min' ss's'")}
            </Td>
          </Tr>
        </Tbody>
      </Table>
    </Box>
  );
}

function TimeLine({ data }: { data: SerializeFrom<typeof loader> }) {
  const firstEvent = data?.game?.startDay.events[0];
  const lastEvent =
    data?.game?.startDay.events[data?.game?.startDay.events.length - 1];
  const start = firstEvent
    ? DateTime.fromISO(firstEvent.time, { zone: data?.timeZone })
    : null;
  const end = lastEvent
    ? DateTime.fromISO(lastEvent.time, { zone: data?.timeZone })
    : null;
  const duration = start && end ? end.diff(start) : null;
  const percentsPerSecond = 100 / (duration?.as("seconds") ?? 0);

  return (
    <Box>
      <ClientOnly>
        {() => (
          <Box>
            <XYChart
              margin={{ top: 0, right: 0, bottom: 20, left: 30 }}
              height={300}
              xScale={{ type: "linear" }}
              yScale={{ type: "linear" }}
            >
              <AnimatedAxis
                orientation="bottom"
                tickFormat={(v) =>
                  (Number(v) / 60).toLocaleString("sv-SE", {
                    maximumFractionDigits: 1,
                  })
                }
              />
              <AnimatedAxis orientation="left" />
              <AnimatedGrid />

              <AnimatedLineSeries
                dataKey="Puls"
                data={
                  data?.game?.startDay.heartRateSummary?.samples.map((s) => ({
                    x: DateTime.fromISO(s.time, {
                      zone: data?.timeZone,
                    }).toJSDate(),
                    y: s.heartRate,
                  })) ?? []
                }
                xAccessor={(p) => p.x ?? 0}
                yAccessor={(p) => p.y}
                stroke="var(--chakra-colors-blue-800)"
                strokeWidth={1}
              />
            </XYChart>
          </Box>
        )}
      </ClientOnly>

      <Box paddingLeft="30px">
        <Box position="relative" width="100%">
          <Box position="absolute" top={1.5} h="1px" bg="gray.300" w="100%" />
          {data?.game?.startDay.events.map((event) => {
            return (
              <Tooltip
                key={event.time}
                label={`${DateTime.fromISO(event.time, {
                  zone: data?.timeZone,
                }).toFormat("HH:mm")}: ${event.description}`}
              >
                <Box
                  position="absolute"
                  left={`${(
                    percentsPerSecond *
                    DateTime.fromISO(event.time, { zone: data?.timeZone })
                      .diff(start!)
                      .as("seconds")
                  ).toFixed(3)}%`}
                  width={3}
                  height={3}
                  marginLeft={-1.5}
                  borderRadius="full"
                  bg="gray.500"
                />
              </Tooltip>
            );
          })}
        </Box>
      </Box>
    </Box>
  );
}
