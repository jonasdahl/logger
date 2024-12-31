import type { LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { DateTime } from "luxon";
import { z } from "zod";
import { authenticator } from "~/.server/auth.server";
import {
  AnimatedAreaSeries,
  AnimatedAxis,
  AnimatedGrid,
  AnimatedLineSeries,
  XYChart,
} from "~/components/charts/xy-chart.client";
import { ClientOnly } from "~/components/client-only";
import { Container } from "~/components/ui/container";
import { ExerciseTimelineDocument } from "~/graphql/generated/documents";
import { gqlData } from "~/graphql/graphql.server";

export async function loader({ request, params }: LoaderFunctionArgs) {
  await authenticator.isAuthenticated(request, { failureRedirect: "/" });
  const { exerciseId } = z.object({ exerciseId: z.string() }).parse(params);
  return gqlData({
    document: ExerciseTimelineDocument,
    request,
    variables: { exerciseId },
    requiredProperties: ["me"],
  });
}

export default function Timeline() {
  const { me, exercise } = useLoaderData<typeof loader>();
  const maxHeartRate = me.maxPulse;
  const heartRateSamples = (
    exercise?.startDay.heartRateSummary?.samples || []
  ).map((s) => ({ value: s.heartRate, tStart: DateTime.fromISO(s.time) }));
  const zones = [
    { name: "Zon 1", max: 59.999, color: "var(--chakra-colors-green-600)" },
    { name: "Zon 2", max: 75.999, color: "var(--chakra-colors-green-400)" },
    { name: "Zon 3", max: 85.999, color: "var(--chakra-colors-yellow-500)" },
    { name: "Zon 4", max: 93.999, color: "var(--chakra-colors-red-400)" },
    { name: "Zon 5", max: 100, color: "var(--chakra-colors-red-600)" },
  ]
    .map(({ name, max, color }) => ({
      name,
      color,
      maxRelative: max,
      maxAbsolute: maxHeartRate ? maxHeartRate * (max / 100) : null,
    }))
    .map((x, i, arr) => ({
      ...x,
      minAbsolute: arr[i - 1]?.maxAbsolute ?? 0,
      minRelative: arr[i - 1]?.maxRelative ?? 0,
    }));

  const timestamps = heartRateSamples.map((s) => s.tStart.toMillis());
  const tMax = Math.max(...timestamps);
  const tMin = Math.min(...timestamps);

  console.log({ tMax, tMin });

  return (
    <Container className="pb-0">
      <div className="flex flex-col gap-1">
        <ClientOnly>
          {() => (
            <XYChart
              margin={{ top: 0, right: 0, bottom: 20, left: 30 }}
              height={300}
              xScale={{ type: "time" }}
              yScale={{ type: "linear" }}
            >
              <AnimatedAxis orientation="bottom" />
              <AnimatedAxis orientation="left" />
              <AnimatedGrid />

              {zones.map((z) => (
                <AnimatedAreaSeries
                  dataKey={z.name}
                  key={z.name}
                  fill={z.color}
                  strokeWidth={0}
                  renderLine={false}
                  data={[
                    { x: tMin, y: z.maxAbsolute, y0: z.minAbsolute },
                    { x: tMax, y: z.maxAbsolute, y0: z.minAbsolute },
                  ]}
                  xAccessor={(p) => p.x}
                  yAccessor={(p) => p.y}
                  y0Accessor={(p) => p.y0}
                  opacity={0.5}
                />
              ))}

              <AnimatedLineSeries
                dataKey="Puls"
                data={heartRateSamples.map((s) => ({
                  x: s.tStart,
                  y: s.value,
                }))}
                xAccessor={(p) => p.x ?? 0}
                yAccessor={(p) => p.y}
                strokeWidth={1}
              />
            </XYChart>
          )}
        </ClientOnly>
      </div>
    </Container>
  );
}
