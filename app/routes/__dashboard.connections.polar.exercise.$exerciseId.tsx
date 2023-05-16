import {
  Box,
  Code,
  Container,
  Heading,
  Stack,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { sum } from "lodash";
import { Duration } from "luxon";
import { ClientOnly } from "remix-utils";
import { z } from "zod";
import { authenticator } from "~/auth.server";
import {
  AnimatedAxis,
  AnimatedGrid,
  AnimatedLineSeries,
  LineSeries,
  XYChart,
} from "~/components/charts/xy-chart.client";
import { db } from "~/db.server";

export async function loader({ request, params }: LoaderArgs) {
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: "/connections",
  });

  const exercise = await db.polarExercise.findFirstOrThrow({
    where: { userId: user.id, id: params.exerciseId },
  });

  return json({
    exercise,
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
  const { exercise, samples } = useLoaderData<typeof loader>();
  const maxHeartRate = 197; // TODO
  const heartRateSamples = samples
    .filter((s) => s.sampleType === "0")
    .flatMap((s) =>
      s.samples.data.map((x) => {
        const v = Number(x);
        if (!v || isNaN(v)) {
          return { value: null, duration: s.samples["recording-rate"] };
        }
        return { value: v, duration: s.samples["recording-rate"] };
      })
    );
  const zones = [
    { name: "Zon 1", max: 59.999 },
    { name: "Zon 2", max: 75.999 },
    { name: "Zon 3", max: 85.999 },
    { name: "Zon 4", max: 93.999 },
    { name: "Zon 5", max: 100 },
  ].map(({ name, max }) => ({
    name,
    maxRelative: max,
    max: maxHeartRate * (max / 100),
  }));
  const heartRateZones = zones.map((zone, i, arr) => ({
    zone,
    samples: heartRateSamples.filter(
      (s) =>
        s.value !== null &&
        s.value <= zone.max &&
        !arr.filter((_, j) => j < i).some((z) => s.value! <= z.max)
    ),
  }));

  return (
    <Container py={5} maxW="container.xl">
      <Stack>
        <Heading>Träning från Polar</Heading>
        <Heading size="md">Puls</Heading>
        <TableContainer>
          <Table>
            <Thead>
              <Tr>
                <Th>Zon</Th>
                <Th>Puls (rel)</Th>
                <Th>Puls (abs)</Th>
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
                    &lt;{zone.maxRelative.toFixed(0)}%
                  </Td>
                  <Td w={1} whiteSpace="nowrap">
                    &lt;{zone.max.toFixed(0)}
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
        <Box>
          <ClientOnly>
            {() => (
              <XYChart
                height={300}
                xScale={{ type: "linear" }}
                yScale={{ type: "linear" }}
              >
                <AnimatedAxis orientation="bottom" />
                <AnimatedAxis orientation="left" />
                <AnimatedGrid />
                {zones.map((z) => (
                  <LineSeries
                    dataKey={z.name}
                    key={z.name}
                    data={[
                      { x: 0, y: z.max },
                      { x: 60, y: z.max },
                    ]}
                    xAccessor={(p) => p.x / 60}
                    yAccessor={(p) => p.y}
                  />
                ))}
                {samples
                  .filter((s) => s.sampleType === "0")
                  .map((sample) => (
                    <AnimatedLineSeries
                      key={sample.sampleType}
                      dataKey={sample.sampleType}
                      data={sample.samples.data.map((y, xDelta) => ({
                        y: isNaN(Number(y)) || !Number(y) ? null : Number(y),
                        x: xDelta * sample.samples["recording-rate"],
                      }))}
                      xAccessor={(p) => p.x / 60}
                      yAccessor={(p) => p.y}
                    />
                  ))}
              </XYChart>
            )}
          </ClientOnly>
        </Box>

        <Code as="pre" p={3} overflowX="auto">
          {JSON.stringify(exercise, null, 4)}
        </Code>
        <Heading>Raw</Heading>
        <Code as="pre" p={3} overflowX="auto">
          {JSON.stringify(JSON.parse(exercise.raw), null, 4)}
        </Code>
        <Heading>Samples</Heading>
        <Code as="pre" p={3} overflowX="auto">
          {JSON.stringify(samples, null, 4)}
        </Code>
      </Stack>
    </Container>
  );
}
