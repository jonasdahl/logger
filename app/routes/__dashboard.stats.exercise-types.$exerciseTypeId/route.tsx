import { Text } from "@chakra-ui/react";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import createColormap from "colormap";
import { DateTime, Duration, Interval } from "luxon";
import { useState } from "react";
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
import { H1, H2 } from "~/components/headings";
import { Card } from "~/components/ui/card";
import { TitleRow } from "~/components/ui/title-row";
import { StatsExerciseTypeDocument } from "~/graphql/generated/documents";
import { gql } from "~/graphql/graphql.server";
import { cn } from "~/lib/utils";
import { getTimeZoneFromRequest } from "~/time";

export async function loader({ request, params }: LoaderFunctionArgs) {
  await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  });

  const res = await gql({
    document: StatsExerciseTypeDocument,
    request,
    variables: { exerciseTypeId: params.exerciseTypeId! },
  });

  return json({ ...res, timeZone: getTimeZoneFromRequest(request) });
}

const enum TimeGrouping {
  Month,
  Week,
}

const timeGroupOptions = [TimeGrouping.Month, TimeGrouping.Week];

const timeGroupLabels = {
  [TimeGrouping.Month]: "Månad",
  [TimeGrouping.Week]: "Vecka",
};

export default function ExerciseTypeStats() {
  const { data } = useLoaderData<typeof loader>();
  const [timeGrouping, setTimeGrouping] = useState(TimeGrouping.Month);

  return (
    <div className="container max-w-screen-md px-4 mx-auto py-5">
      <div className="flex flex-col gap-5">
        <TitleRow
          actions={
            <div className="border rounded-lg px-1 py-1 gap-1 flex-row flex">
              {timeGroupOptions.map((option) => {
                return (
                  <button
                    key={option}
                    className={cn(
                      "bg-transparent hover:bg-gray-100 rounded px-2 py-1 text-sm font-bold",
                      timeGrouping === option && "bg-gray-200"
                    )}
                    onClick={() => setTimeGrouping(option)}
                  >
                    {timeGroupLabels[option]}
                  </button>
                );
              })}
            </div>
          }
        >
          <H1 className="truncate">{data?.exerciseType?.name}</H1>
        </TitleRow>

        <ClientOnly>
          {() => <OneRepMaxChart timeGrouping={timeGrouping} />}
        </ClientOnly>
        <ClientOnly>
          {() => <BarLoadChart timeGrouping={timeGrouping} />}
        </ClientOnly>
        <ClientOnly>{() => <TimeChart />}</ClientOnly>
        <ClientOnly>{() => <RepsChart />}</ClientOnly>
        <ClientOnly>{() => <LoadChart />}</ClientOnly>
        <ClientOnly>{() => <TotalLoadChart />}</ClientOnly>
        <ClientOnly>{() => <LevelsChart />}</ClientOnly>
      </div>
    </div>
  );
}

function OneRepMaxChart({ timeGrouping }: { timeGrouping: TimeGrouping }) {
  const { data, timeZone } = useLoaderData<typeof loader>();

  const endOfThisMonth = DateTime.now()
    .setZone(timeZone)
    .startOf("month")
    .plus({ month: 1 });

  const intervals = Interval.fromDateTimes(
    endOfThisMonth.minus({ years: 1 }),
    endOfThisMonth
  ).splitBy(timeGrouping === TimeGrouping.Week ? { week: 1 } : { month: 1 });

  const allLoadAmounts = (data?.exerciseType?.history.dayAmounts || []).flatMap(
    ({ dayAmounts, dayStart }) =>
      dayAmounts.flatMap((d) =>
        d.loads.map((load) => ({ ...load, dayStart, duration: d.duration }))
      )
  );
  const loadAmountsPerType = groupBy(
    allLoadAmounts,
    (loadAmount) => loadAmount.type.id
  );

  const colors = createColormap({
    colormap: [
      { index: 0, rgb: [0, 0, 255] },
      { index: 1, rgb: [120, 0, 255] },
    ],
    alpha: [0.2, 1],
    format: "rgbaString",
    nshades: Math.max(3, Object.keys(loadAmountsPerType).length * 2),
  }).reverse();

  const allSeries = Object.entries(loadAmountsPerType).map(
    ([typeId, loadAmounts], i) => {
      return {
        name: typeId,
        colors: [colors[i % colors.length], colors[(2 * i) % colors.length]],
        data: intervals
          .map((interval) => {
            const amountsInInterval = loadAmounts.filter((loadAmount) =>
              interval.contains(DateTime.fromISO(loadAmount.dayStart))
            );
            return { interval, amountsInInterval };
          })
          .filter(
            ({ amountsInInterval }, i, arr) =>
              i === 0 || amountsInInterval.length || i === arr.length - 1
          )
          .map(({ interval, amountsInInterval }) => {
            return {
              interval,
              max: !amountsInInterval.length
                ? null
                : Math.max(...amountsInInterval.map((l) => l.value)),
              oneRepMax: !amountsInInterval.length
                ? null
                : Math.max(
                    ...amountsInInterval.map(
                      (l) =>
                        l.value *
                        (1 +
                          (l.duration.__typename ===
                          "ExerciseDurationRepetitions"
                            ? l.duration.repetitions
                            : 0) /
                            30)
                    )
                  ),
            };
          }),
      };
    }
  );

  const customTheme = buildChartTheme({
    gridColor: "var(--chakra-colors-gray-200)",
    colors: ["var(--chakra-colors-blue-500)"],
    backgroundColor: "",
    tickLength: 0,
    gridColorDark: "",
  });

  if (!allSeries.length) {
    return null;
  }

  return (
    <div className="flex flex-col gap-3">
      <H2>1-rep max över tid</H2>
      <div>
        <XYChart
          theme={customTheme}
          margin={{ top: 0, right: 0, bottom: 20, left: 30 }}
          height={300}
          xScale={{ type: "time" }}
          yScale={{ type: "linear", zero: false, nice: true, round: true }}
        >
          <AnimatedAxis
            orientation="bottom"
            tickFormat={(p) => DateTime.fromJSDate(p).toFormat("yyyy-MM")}
          />
          <AnimatedAxis orientation="left" />
          <AnimatedGrid />

          {allSeries.map((series) => {
            return (
              <>
                <AnimatedLineSeries
                  dataKey={`1-rep max ${series.name}`}
                  data={series.data}
                  colorAccessor={() => series.colors[0]}
                  xAccessor={(p) => p.interval.start?.toJSDate()}
                  yAccessor={(p) => p.oneRepMax}
                />

                <AnimatedGlyphSeries
                  dataKey={`1-rep max punkter ${series.name}`}
                  data={series.data}
                  colorAccessor={() => series.colors[0]}
                  xAccessor={(p) => p.interval.start?.toJSDate()}
                  yAccessor={(p) => p.oneRepMax}
                />

                <AnimatedLineSeries
                  dataKey={`Max ${series.name}`}
                  data={series.data}
                  colorAccessor={() => series.colors[1]}
                  xAccessor={(p) => p.interval.start?.toJSDate()}
                  yAccessor={(p) => p.max}
                />

                <AnimatedGlyphSeries
                  dataKey={`Max punkter ${series.name}`}
                  data={series.data}
                  colorAccessor={() => series.colors[1]}
                  xAccessor={(p) => p.interval.start?.toJSDate()}
                  yAccessor={(p) => p.max}
                />
              </>
            );
          })}
        </XYChart>
      </div>
    </div>
  );
}

function BarLoadChart({ timeGrouping }: { timeGrouping: TimeGrouping }) {
  const { data, timeZone } = useLoaderData<typeof loader>();

  const amountsPerLoad = groupBy(
    (data?.exerciseType?.history.dayAmounts || [])
      .flatMap((dayAmount) => {
        return [...(dayAmount?.dayAmounts || [])].map((amount) => ({
          amount,
          origin: dayAmount,
        }));
      })
      .flatMap(({ amount, origin }) => {
        const array = amount?.loads?.length ? amount.loads : [null];
        return array.map((load) => ({
          load,
          origin: { amount, origin },
        }));
      }),
    (x) => x.load?.type.id || "-"
  );

  const groupedData = mapValues(amountsPerLoad, (loads) => {
    const loadsByValue = groupBy(
      sortBy(loads, (l) => -(l.load?.value || 0)),
      ({ load }) => load?.value || 0
    );
    return loadsByValue;
  });

  const endOfThisMonth = DateTime.now()
    .setZone(timeZone)
    .startOf("month")
    .plus({ month: 1 });

  const intervals = Interval.fromDateTimes(
    endOfThisMonth.minus({ years: 1 }),
    endOfThisMonth
  ).splitBy(timeGrouping === TimeGrouping.Week ? { week: 1 } : { month: 1 });

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
    colormap: [
      { index: 0, rgb: [0, 0, 255] },
      { index: 1, rgb: [120, 0, 255] },
    ],
    alpha: [0.2, 1],
    format: "rgbaString",
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

  if (!series.length) {
    return null;
  }

  return (
    <div className="flex flex-col gap-3">
      <H2>Belastning över tid</H2>
      <div>
        <XYChart
          theme={customTheme}
          margin={{ top: 0, right: 0, bottom: 20, left: 30 }}
          height={300}
          xScale={{ type: "band", padding: 0.1 }}
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
                  barPadding={0.1}
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
      </div>
    </div>
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
    <div className="flex flex-col gap-3">
      <H2>Tid</H2>
      <div>
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
      </div>
    </div>
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
        <Card>
          {Object.entries(tooltipData?.nearestDatum?.datum ?? {}).map(
            ([key, value]) => (
              <div key={key}>
                <Text fontWeight="bold" as="span">
                  {key}
                </Text>
                : {String(value)}
              </div>
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
    <div className="flex flex-col gap-3">
      <H2>Repetitioner</H2>
      <div>
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
      </div>
    </div>
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
    <div className="flex flex-col gap-3">
      <H2>Belastning</H2>
      <div>
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
      </div>
    </div>
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
    <div className="flex flex-col gap-3">
      <H2>Nivåer</H2>
      <div>
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
      </div>
    </div>
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
    <div className="flex flex-col gap-3">
      <H2>Total belastning</H2>
      <div>
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
      </div>
    </div>
  );
}
