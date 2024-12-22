import { Box, Card, Container, Heading, Stack, Text } from "@chakra-ui/react";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import createColormap from "colormap";
import { DateTime, Duration, Interval } from "luxon";
import { groupBy, mapValues, sortBy, sum, sumBy } from "remeda";
import { authenticator } from "~/.server/auth.server";
import {
  AnimatedAxis,
  AnimatedBarSeries,
  AnimatedBarStack,
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

        <ClientOnly>{() => <WeeklyLoadChart />}</ClientOnly>
        <ClientOnly>{() => <TimeChart />}</ClientOnly>
        <ClientOnly>{() => <RepsChart />}</ClientOnly>
        <ClientOnly>{() => <LoadChart />}</ClientOnly>
        <ClientOnly>{() => <TotalLoadChart />}</ClientOnly>
        <ClientOnly>{() => <LevelsChart />}</ClientOnly>
      </Stack>
    </Container>
  );
}

function WeeklyLoadChart() {
  const { data } = useLoaderData<typeof loader>();

  const amountsPerLoad = groupBy(
    (data?.exerciseType?.history.dayAmounts || [])
      .flatMap((dayAmount) => {
        return [...(dayAmount?.dayAmounts || [])].map((amount) => ({
          amount,
          origin: dayAmount,
        }));
      })
      .flatMap(({ amount, origin }) => {
        return [null, ...(amount?.loads || [])].map((load) => ({
          load,
          origin: { amount, origin },
        }));
      }),
    (x) => x.load?.type.id || "-"
  );

  console.log({ amountsPerLoad });

  const groupedData = mapValues(amountsPerLoad, (loads) => {
    const loadsByValue = groupBy(
      sortBy(loads, (l) => -(l.load?.value || 0)),
      ({ load }) => load?.value || 0
    );
    return loadsByValue;
  });

  const endOfThisMonth = DateTime.now().startOf("month").plus({ month: 1 });

  const intervals = Interval.fromDateTimes(
    endOfThisMonth.minus({ years: 1 }),
    endOfThisMonth
  ).splitBy({ month: 1 });

  const seriesWithoutColors = Object.entries(groupedData).flatMap(
    ([loadId, items]) =>
      Object.entries(items).flatMap(([loadValue, items], index) => ({
        typeId: loadId,
        value: loadValue,
        seriesId: `load:${loadId}-value:${loadValue}`,
        index,
        itemsByWeek: intervals.map((interval) => {
          const itemsInInterval = items.filter(
            (x) =>
              x.origin.origin &&
              interval.contains(DateTime.fromISO(x.origin.origin.dayStart))
          );
          return {
            interval,
            items: itemsInInterval,
            sum: sumBy(itemsInInterval, (i) =>
              i.origin.amount?.duration.__typename ===
              "ExerciseDurationRepetitions"
                ? i.origin.amount.duration.repetitions
                : i.origin.amount?.duration.__typename ===
                  "ExerciseDurationTime"
                ? i.origin.amount.duration.durationSeconds
                : i.origin.amount.duration.levelType?.ordinal
            ),
            sumType: itemsInInterval[0]?.origin.amount?.duration.__typename,
            value: loadValue,
          };
        }),
      }))
  );

  const colors = createColormap({
    colormap: "bluered",
    alpha: [0, 1],
    nshades: Math.max(3, seriesWithoutColors.length),
  }).reverse();

  const series = sortBy(seriesWithoutColors, (x) => -x.value).map((s, i) => {
    const color = colors[i % colors.length]!.toString();
    return {
      ...s,
      color,
      itemsByWeek: s.itemsByWeek.map((i) => ({ ...i, color })),
    };
  });

  const customTheme = buildChartTheme({
    gridColor: "var(--chakra-colors-gray-200)",
    colors: ["var(--chakra-colors-blue-500)"],
    backgroundColor: "",
    tickLength: 0,
    gridColorDark: "",
  });

  return (
    <Stack>
      <Heading size="md">Månadsvis belastning</Heading>
      <Box>
        <XYChart
          theme={customTheme}
          margin={{ top: 0, right: 0, bottom: 20, left: 30 }}
          height={300}
          xScale={{ type: "band" }}
          yScale={{ type: "linear" }}
        >
          <AnimatedAxis
            orientation="bottom"
            tickFormat={(p) => DateTime.fromJSDate(p).toFormat("yyyy-MM")}
          />
          <AnimatedAxis orientation="left" />
          <AnimatedGrid />

          <AnimatedBarStack>
            {series.flatMap((chartData) => {
              return [
                <AnimatedBarSeries
                  dataKey={`${chartData.seriesId}glyphs`}
                  key={`${chartData.seriesId}glyphs`}
                  data={chartData.itemsByWeek}
                  xAccessor={(p) => p.interval.start?.toJSDate()}
                  yAccessor={(p) => {
                    return p.sum || 0;
                  }}
                  colorAccessor={(p) => p.color}
                />,
              ];
            })}
          </AnimatedBarStack>

          <Tooltip<typeof series[number]["itemsByWeek"][number]>
            snapTooltipToDatumX
            snapTooltipToDatumY
            showVerticalCrosshair
            showSeriesGlyphs
            unstyled
            applyPositionStyle
            renderTooltip={({ tooltipData, colorScale }) => (
              <div className="p-3 rounded-md text-sm bg-white shadow-md">
                <h6 className="font-bold">
                  {tooltipData?.nearestDatum?.datum?.interval?.start?.toFormat(
                    "MMMM yyyy"
                  )}
                </h6>

                <table className="w-full">
                  <thead>
                    <tr>
                      <th className="w-1 pr-2" />
                      <th className="text-left pr-2">Belastning</th>
                      <th className="text-left">Totalt</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(tooltipData?.datumByKey ?? {})
                      .filter((x) => x[1].datum.sum)
                      .map(([key, i]) => {
                        return (
                          <tr key={key}>
                            <td className="pr-2">
                              <div
                                className="rounded-full w-4 h-4"
                                style={{ background: i.datum.color }}
                              />
                            </td>
                            <td className="pr-2">
                              {i.datum.value || "-"}{" "}
                              {i.datum.items?.[0]?.load?.unit}
                            </td>
                            <td>
                              {i.datum.sumType === "ExerciseDurationTime"
                                ? Duration.fromMillis(i.datum.sum * 1000)
                                    .shiftTo("hours", "minutes", "seconds")
                                    .toHuman()
                                : i.datum.sumType ===
                                  "ExerciseDurationRepetitions"
                                ? `${i.datum.sum || "-"} reps`
                                : i.datum.sum}
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
            )}
          />
        </XYChart>
      </Box>
    </Stack>
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
