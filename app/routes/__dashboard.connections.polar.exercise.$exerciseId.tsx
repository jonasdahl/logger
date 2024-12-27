import {
  Alert,
  AlertDescription,
  Container,
  Heading,
  Stack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Table,
  TableContainer,
  Tabs,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData, useLocation } from "@remix-run/react";

import { Duration } from "luxon";
import { sum } from "remeda";
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
import { InlineLink } from "~/components/ui/inline-link";
import { db } from "~/db.server";

export async function loader({ request, params }: LoaderFunctionArgs) {
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: "/connections",
  });

  const exercise = await db.polarExercise.findFirstOrThrow({
    where: { userId: user.id, id: params.exerciseId },
  });

  const { maxPulse } = await db.user.findUniqueOrThrow({
    where: { id: user.id },
  });

  return json({
    maxPulse,
    samples: z
      .array(
        z.object({
          sampleType: z.string(),
          samples: z.object({
            "recording-rate": z.number(),
            data: z.array(z.string()),
          }),
        })
      )
      .parse(JSON.parse(exercise.samples ?? "[]")),
  });
}

export default function PolarExercise() {
  const { samples, maxPulse: maxHeartRate } = useLoaderData<typeof loader>();
  const heartRateSamples = samples
    .filter((s) => s.sampleType === "0")
    .flatMap((s) =>
      s.samples.data.map((x, i) => {
        const v = Number(x);
        if (!v || isNaN(v)) {
          return { value: null, duration: s.samples["recording-rate"] };
        }
        return {
          value: v,
          duration: s.samples["recording-rate"],
          tStart: i * s.samples["recording-rate"],
        };
      })
    );
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
  const heartRateZones = zones.map((zone, i, arr) => ({
    zone,
    samples: heartRateSamples.filter(
      (s) =>
        s.value !== null &&
        zone.maxAbsolute !== null &&
        s.value <= zone.maxAbsolute &&
        !arr.filter((_, j) => j < i).some((z) => s.value! <= z.maxAbsolute!)
    ),
  }));
  const location = useLocation();

  const timestamps = heartRateSamples.map((s) => s.tStart ?? 0);
  const tMax = Math.max(...timestamps);
  const tMin = Math.min(...timestamps);

  return (
    <Container py={5} maxW="container.xl">
      <Stack spacing={5}>
        <Heading>Träning från Polar</Heading>
        <Heading size="md">Puls</Heading>
        {!maxHeartRate ? (
          <Alert status="warning">
            <AlertDescription>
              <InlineLink to={`/user?returnTo=${location.pathname}`}>
                Lägg in din maxpuls
              </InlineLink>{" "}
              för att visa pulszoner.
            </AlertDescription>
          </Alert>
        ) : (
          <Tabs>
            <TabList>
              <Tab>Tid i zon</Tab>
              <Tab>Graf</Tab>
            </TabList>
            <TabPanels px={0}>
              <TabPanel px={0}>
                <TableContainer>
                  <Table size="sm">
                    <Thead>
                      <Tr>
                        <Th>Zon</Th>
                        <Th>Relativ</Th>
                        <Th>Absolut</Th>
                        <Th>Tid i zon</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {heartRateZones.map(({ zone, samples }) => (
                        <Tr key={zone.name}>
                          <Td w={1} whiteSpace="nowrap">
                            {zone.name}
                          </Td>
                          <Td w={1} whiteSpace="nowrap">
                            {zone.minRelative.toFixed(0)}% -{" "}
                            {zone.maxRelative.toFixed(0)}%
                          </Td>
                          <Td w={1} whiteSpace="nowrap">
                            {zone.minAbsolute?.toFixed(0)} -{" "}
                            {zone.maxAbsolute?.toFixed(0)}
                          </Td>
                          <Td>
                            {Duration.fromMillis(
                              sum(samples.map((s) => s.duration)) * 1000
                            )
                              .shiftTo("minutes", "seconds")
                              .toFormat("m'min' ss's'")}
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </TableContainer>
              </TabPanel>
              <TabPanel px={0}>
                <div>
                  <ClientOnly>
                    {() => (
                      <XYChart
                        margin={{ top: 0, right: 0, bottom: 20, left: 30 }}
                        height={400}
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

                        {zones.map((z) => (
                          <AnimatedAreaSeries
                            dataKey={z.name}
                            key={z.name}
                            fill={z.color}
                            strokeWidth={0}
                            renderLine={false}
                            data={[
                              {
                                x: tMin,
                                y: z.maxAbsolute,
                                y0: z.minAbsolute,
                              },
                              {
                                x: tMax,
                                y: z.maxAbsolute,
                                y0: z.minAbsolute,
                              },
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
                            x: s.tStart ?? null,
                            y: s.value ?? null,
                          }))}
                          xAccessor={(p) => p.x ?? 0}
                          yAccessor={(p) => p.y}
                          stroke="var(--chakra-colors-blue-800)"
                          strokeWidth={1}
                        />
                      </XYChart>
                    )}
                  </ClientOnly>
                </div>
              </TabPanel>
            </TabPanels>
          </Tabs>
        )}
      </Stack>
    </Container>
  );
}
