import { Box, Container, Heading, Stack } from "@chakra-ui/react";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { DateTime } from "luxon";
import { authenticator } from "~/auth.server";
import {
  AnimatedAxis,
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
          <ClientOnly>{() => <Chart />}</ClientOnly>
        </Box>
      </Stack>
    </Container>
  );
}

function Chart() {
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

      <AnimatedLineSeries
        dataKey="Values"
        data={chartData}
        xAccessor={(p) => p.x.toJSDate()}
        yAccessor={(p) => p.minTime}
        strokeWidth={1}
      />
      <AnimatedLineSeries
        dataKey="Values"
        data={chartData}
        xAccessor={(p) => p.x.toJSDate()}
        yAccessor={(p) => p.maxTime}
        strokeWidth={1}
      />
    </XYChart>
  );
}
