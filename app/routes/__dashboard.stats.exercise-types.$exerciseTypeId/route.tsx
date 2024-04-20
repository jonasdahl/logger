import { Box, Card, Container, Heading, Stack, Text } from "@chakra-ui/react";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { DateTime } from "luxon";
import { sum } from "remeda";
import { authenticator } from "~/.server/auth.server";
import {
  AnimatedAxis,
  AnimatedGlyphSeries,
  AnimatedGrid,
  AnimatedLineSeries,
  Tooltip,
  XYChart,
  buildChartTheme,
} from "~/components/charts/xy-chart.client";
import { ClientOnly } from "~/components/client-only";
import { StatsExerciseTypeDocument } from "~/graphql/generated/documents";
import { gql } from "~/graphql/graphql.server";

export async function loader({ request, params }: LoaderFunctionArgs) {
  await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  });

  const res = await gql({
    document: StatsExerciseTypeDocument,
    request,
    variables: { exerciseTypeId: params.exerciseTypeId! },
  });

  return json(res);
}

export default function ExerciseTypeStats() {
  const { data } = useLoaderData<typeof loader>();

  return (
    <Container py={5} maxW="container.md">
      <Stack spacing={5}>
        <Heading>{data?.exerciseType?.name}</Heading>

        <ClientOnly>{() => <TimeChart />}</ClientOnly>
        <ClientOnly>{() => <RepsChart />}</ClientOnly>
        <ClientOnly>{() => <LoadChart />}</ClientOnly>
        <ClientOnly>{() => <TotalLoadChart />}</ClientOnly>
        <ClientOnly>{() => <LevelsChart />}</ClientOnly>
      </Stack>
    </Container>
  );
}

function TimeChart() {
  const { data } = useLoaderData<typeof loader>();

  const chartData =
    data?.exerciseType?.history.dayAmounts
      .map((dayAmount) => {
        const durationsSeconds = dayAmount.dayAmounts
          .map((a) =>
            a.duration.__typename === "ExerciseDurationTime"
              ? a.duration.durationSeconds
              : null
          )
          .filter((x) => x !== null) as number[];
        return {
          x: DateTime.fromISO(dayAmount.dayStart),
          maxTime:
            durationsSeconds.length === 0
              ? null
              : Math.max(...durationsSeconds),
          minTime:
            durationsSeconds.length === 0
              ? null
              : Math.min(...durationsSeconds),
        };
      })
      .filter((x) => x.minTime !== null) ?? [];

  const customTheme = buildChartTheme({
    gridColor: "var(--chakra-colors-gray-200)",
    colors: ["var(--chakra-colors-blue-500)"],
    backgroundColor: "",
    tickLength: 0,
    gridColorDark: "",
  });

  if (!chartData.length) {
    return null;
  }

  return (
    <Stack>
      <Heading size="md">Tid</Heading>
      <Box>
        <XYChart
          theme={customTheme}
          margin={{ top: 0, right: 0, bottom: 20, left: 30 }}
          height={300}
          xScale={{ type: "time" }}
          yScale={{ type: "linear" }}
        >
          <AnimatedAxis orientation="bottom" />
          <AnimatedAxis orientation="left" />
          <AnimatedGrid />

          <AnimatedGlyphSeries
            dataKey="MinGlyphs"
            data={chartData}
            xAccessor={(p) => p.x.toJSDate()}
            yAccessor={(p) => p.minTime}
          />
          <AnimatedGlyphSeries
            dataKey="MaxGlyphs"
            data={chartData}
            xAccessor={(p) => p.x.toJSDate()}
            yAccessor={(p) => p.maxTime}
          />
          <AnimatedLineSeries
            dataKey="Min"
            data={chartData}
            xAccessor={(p) => p.x.toJSDate()}
            yAccessor={(p) => p.minTime}
            strokeWidth={1}
          />
          <AnimatedLineSeries
            dataKey="Max"
            data={chartData}
            xAccessor={(p) => p.x.toJSDate()}
            yAccessor={(p) => p.maxTime}
            strokeWidth={1}
          />
          <BasicTooltip />
        </XYChart>
      </Box>
    </Stack>
  );
}

function BasicTooltip() {
  return (
    <Tooltip
      snapTooltipToDatumX
      snapTooltipToDatumY
      showVerticalCrosshair
      showSeriesGlyphs
      unstyled
      applyPositionStyle
      renderTooltip={({ tooltipData, colorScale }) => (
        <Card p={3} fontSize="sm">
          {Object.entries(tooltipData?.nearestDatum?.datum ?? {}).map(
            ([key, value]) => (
              <Box key={key}>
                <Text fontWeight="bold" as="span">
                  {key}
                </Text>
                : {String(value)}
              </Box>
            )
          )}
        </Card>
      )}
    />
  );
}

function RepsChart() {
  const { data } = useLoaderData<typeof loader>();

  const chartData =
    data?.exerciseType?.history.dayAmounts
      .map((dayAmount) => {
        const reps = dayAmount.dayAmounts
          .map((a) =>
            a.duration.__typename === "ExerciseDurationRepetitions"
              ? a.duration.repetitions
              : null
          )
          .filter((x) => x !== null) as number[];
        return {
          x: DateTime.fromISO(dayAmount.dayStart),
          total: reps.length === 0 ? null : sum(reps),
          average: reps.length === 0 ? null : sum(reps) / reps.length,
        };
      })
      .filter((x) => x.total !== null) ?? [];

  const customTheme = buildChartTheme({
    gridColor: "var(--chakra-colors-gray-200)",
    colors: ["var(--chakra-colors-blue-500)"],
    backgroundColor: "",
    tickLength: 0,
    gridColorDark: "",
  });

  if (!chartData.length) {
    return null;
  }

  return (
    <Stack>
      <Heading size="md">Repetitioner</Heading>
      <Box>
        <XYChart
          theme={customTheme}
          margin={{ top: 0, right: 0, bottom: 20, left: 30 }}
          height={300}
          xScale={{ type: "time" }}
          yScale={{ type: "linear" }}
        >
          <AnimatedAxis orientation="bottom" />
          <AnimatedAxis orientation="left" />
          <AnimatedGrid />

          <AnimatedGlyphSeries
            dataKey="Glyphs"
            data={chartData}
            xAccessor={(p) => p.x.toJSDate()}
            yAccessor={(p) => p.total}
          />

          <AnimatedLineSeries
            dataKey="Values"
            data={chartData}
            xAccessor={(p) => p.x.toJSDate()}
            yAccessor={(p) => p.total}
            strokeWidth={1}
          />
          <BasicTooltip />
        </XYChart>
      </Box>
    </Stack>
  );
}

function LoadChart() {
  const { data } = useLoaderData<typeof loader>();

  const chartData =
    data?.exerciseType?.history.dayAmounts
      .map((dayAmount) => {
        const loads = dayAmount.dayAmounts
          .flatMap((a) => a.loads.map((load) => load.value))
          .filter((x) => x !== null) as number[];
        return {
          x: DateTime.fromISO(dayAmount.dayStart),
          maxLoad: loads.length === 0 ? null : Math.max(...loads),
          minLoad: loads.length === 0 ? null : Math.min(...loads),
        };
      })
      .filter((x) => x.maxLoad !== null) ?? [];

  const customTheme = buildChartTheme({
    gridColor: "var(--chakra-colors-gray-200)",
    colors: ["var(--chakra-colors-blue-500)"],
    backgroundColor: "",
    tickLength: 0,
    gridColorDark: "",
  });

  if (!chartData.length) {
    return null;
  }

  return (
    <Stack>
      <Heading size="md">Belastning</Heading>
      <Box>
        <XYChart
          theme={customTheme}
          margin={{ top: 0, right: 0, bottom: 20, left: 30 }}
          height={300}
          xScale={{ type: "time" }}
          yScale={{ type: "linear" }}
        >
          <AnimatedAxis orientation="bottom" />
          <AnimatedAxis orientation="left" />
          <AnimatedGrid />

          <AnimatedGlyphSeries
            dataKey="Max Load Glyphs"
            data={chartData}
            xAccessor={(p) => p.x.toJSDate()}
            yAccessor={(p) => p.maxLoad}
          />
          <AnimatedLineSeries
            dataKey="Max Load"
            data={chartData}
            xAccessor={(p) => p.x.toJSDate()}
            yAccessor={(p) => p.maxLoad}
            strokeWidth={1}
          />
          <AnimatedGlyphSeries
            dataKey="Min Load Glyphs"
            data={chartData}
            xAccessor={(p) => p.x.toJSDate()}
            yAccessor={(p) => p.minLoad}
          />
          <AnimatedLineSeries
            dataKey="Min Load"
            data={chartData}
            xAccessor={(p) => p.x.toJSDate()}
            yAccessor={(p) => p.minLoad}
            strokeWidth={1}
          />
          <BasicTooltip />
        </XYChart>
      </Box>
    </Stack>
  );
}

function LevelsChart() {
  const { data } = useLoaderData<typeof loader>();

  const chartData =
    data?.exerciseType?.history.dayAmounts
      .map((dayAmount) => {
        const levelTypes = dayAmount.dayAmounts.flatMap((a) =>
          a.duration.__typename === "ExerciseDurationLevel"
            ? [a.duration.levelType]
            : []
        );
        return {
          x: DateTime.fromISO(dayAmount.dayStart),
          maxLevel:
            levelTypes.length === 0
              ? null
              : Math.max(...levelTypes.map((x) => x.ordinal)),
          maxLevelName:
            levelTypes.length === 0
              ? null
              : levelTypes.find(
                  (x) =>
                    x.ordinal === Math.max(...levelTypes.map((x) => x.ordinal))
                )?.name,
          minLevel:
            levelTypes.length === 0
              ? null
              : Math.min(...levelTypes.map((x) => x.ordinal)),
          minLevelName:
            levelTypes.length === 0
              ? null
              : levelTypes.find(
                  (x) =>
                    x.ordinal === Math.min(...levelTypes.map((x) => x.ordinal))
                )?.name,
        };
      })
      .filter((x) => x.minLevel !== null) ?? [];

  const customTheme = buildChartTheme({
    gridColor: "var(--chakra-colors-gray-200)",
    colors: ["var(--chakra-colors-blue-500)"],
    backgroundColor: "",
    tickLength: 0,
    gridColorDark: "",
  });

  if (!chartData.length) {
    return null;
  }

  return (
    <Stack>
      <Heading size="md">Nivåer</Heading>
      <Box>
        <XYChart
          theme={customTheme}
          margin={{ top: 0, right: 0, bottom: 20, left: 30 }}
          height={300}
          xScale={{ type: "time" }}
          yScale={{ type: "linear" }}
        >
          <AnimatedAxis orientation="bottom" />
          <AnimatedAxis orientation="left" />
          <AnimatedGrid />

          <AnimatedGlyphSeries
            dataKey="MinGlyphs"
            data={chartData}
            xAccessor={(p) => p.x.toJSDate()}
            yAccessor={(p) => p.minLevel}
          />
          <AnimatedGlyphSeries
            dataKey="MaxGlyphs"
            data={chartData}
            xAccessor={(p) => p.x.toJSDate()}
            yAccessor={(p) => p.maxLevel}
          />
          <AnimatedLineSeries
            dataKey="Min"
            data={chartData}
            xAccessor={(p) => p.x.toJSDate()}
            yAccessor={(p) => p.minLevel}
            strokeWidth={1}
          />
          <AnimatedLineSeries
            dataKey="Max"
            data={chartData}
            xAccessor={(p) => p.x.toJSDate()}
            yAccessor={(p) => p.maxLevel}
            strokeWidth={1}
          />
          <BasicTooltip />
        </XYChart>
      </Box>
    </Stack>
  );
}

function TotalLoadChart() {
  const { data } = useLoaderData<typeof loader>();

  const chartData =
    data?.exerciseType?.history.dayAmounts
      .map((dayAmount) => {
        const loadVolumes = dayAmount.dayAmounts
          .flatMap((a) =>
            a.loads.map(
              (load) =>
                load.value *
                (a.duration.__typename === "ExerciseDurationRepetitions"
                  ? a.duration.repetitions
                  : a.duration.__typename === "ExerciseDurationLevel"
                  ? 0
                  : a.duration.durationSeconds)
            )
          )
          .filter((x) => x !== null) as number[];
        return {
          x: DateTime.fromISO(dayAmount.dayStart),
          totalLoad: loadVolumes.length === 0 ? null : sum(loadVolumes),
        };
      })
      .filter((x) => x.totalLoad !== null) ?? [];

  const customTheme = buildChartTheme({
    gridColor: "var(--chakra-colors-gray-200)",
    colors: ["var(--chakra-colors-blue-500)"],
    backgroundColor: "",
    tickLength: 0,
    gridColorDark: "",
  });

  if (!chartData.length) {
    return null;
  }

  return (
    <Stack>
      <Heading size="md">Total belastning</Heading>
      <Box>
        <XYChart
          theme={customTheme}
          margin={{ top: 0, right: 0, bottom: 20, left: 30 }}
          height={300}
          xScale={{ type: "time" }}
          yScale={{ type: "linear" }}
        >
          <AnimatedAxis orientation="bottom" />
          <AnimatedAxis orientation="left" />
          <AnimatedGrid />

          <AnimatedGlyphSeries
            dataKey="Total Load Glyphs"
            data={chartData}
            xAccessor={(p) => p.x.toJSDate()}
            yAccessor={(p) => p.totalLoad}
          />
          <AnimatedLineSeries
            dataKey="Total Load"
            data={chartData}
            xAccessor={(p) => p.x.toJSDate()}
            yAccessor={(p) => p.totalLoad}
            strokeWidth={1}
          />
          <BasicTooltip />
        </XYChart>
      </Box>
    </Stack>
  );
}
