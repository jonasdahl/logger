import { Box, Container, Heading, Stack } from "@chakra-ui/react";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { sum } from "lodash";
import { DateTime } from "luxon";
import { authenticator } from "~/auth.server";
import {
  AnimatedAxis,
  AnimatedGlyphSeries,
  AnimatedGrid,
  AnimatedLineSeries,
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
        <Box>
          <ClientOnly>{() => <TimeChart />}</ClientOnly>
        </Box>
        <Box>
          <ClientOnly>{() => <RepsChart />}</ClientOnly>
        </Box>
        <Box>
          <ClientOnly>{() => <LoadChart />}</ClientOnly>
        </Box>
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
    </XYChart>
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
    </XYChart>
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
          averageLoad: loads.length === 0 ? null : sum(loads) / loads.length,
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
      <AnimatedGlyphSeries
        dataKey="Average Load Glyphs"
        data={chartData}
        xAccessor={(p) => p.x.toJSDate()}
        yAccessor={(p) => p.averageLoad}
      />
      <AnimatedLineSeries
        dataKey="Average Load"
        data={chartData}
        xAccessor={(p) => p.x.toJSDate()}
        yAccessor={(p) => p.averageLoad}
        strokeWidth={1}
      />
    </XYChart>
  );
}
