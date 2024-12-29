import {
  Box,
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
  AnimatedLineSeries,
  XYChart,
} from "~/components/charts/xy-chart.client";
import { ClientOnly } from "~/components/client-only";
import { Container } from "~/components/ui/container";
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
    <Container>
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
    <div>
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
    </div>
  );
}

function TimeLine({ data }: { data: SerializeFrom<typeof loader> }) {
  const timestamps = [
    ...(data?.game?.startDay.events.map((e) =>
      DateTime.fromISO(e.time, { zone: data.timeZone }).toMillis()
    ) ?? []),
    ...(data?.game?.startDay.heartRateSummary?.samples.map((s) =>
      DateTime.fromISO(s.time, { zone: data.timeZone }).toMillis()
    ) ?? []),
  ];
  const startTime = Math.min(...timestamps);
  const endTime = Math.max(...timestamps);
  const start = DateTime.fromMillis(startTime, { zone: data?.timeZone });
  const end = DateTime.fromMillis(endTime, { zone: data?.timeZone });
  const duration = start && end ? end.diff(start) : null;
  const percentsPerSecond = 100 / (duration?.as("seconds") ?? 0);

  return (
    <div>
      {data?.game?.startDay.heartRateSummary?.samples?.length ? (
        <ClientOnly>
          {() => (
            <div>
              <XYChart
                margin={{ top: 0, right: 0, bottom: 30, left: 30 }}
                height={300}
                xScale={{
                  type: "time",
                  domain: [start?.toJSDate() ?? 0, end?.toJSDate() ?? 0],
                }}
                yScale={{ type: "linear" }}
              >
                <AnimatedAxis orientation="bottom" />
                <AnimatedAxis orientation="left" />

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
            </div>
          )}
        </ClientOnly>
      ) : null}

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
    </div>
  );
}
