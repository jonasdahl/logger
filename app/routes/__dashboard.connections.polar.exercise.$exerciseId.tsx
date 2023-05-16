import { Box, Code, Container, Heading, Stack } from "@chakra-ui/react";
import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { ClientOnly } from "remix-utils";
import { z } from "zod";
import { authenticator } from "~/auth.server";
import {
  AnimatedAxis,
  AnimatedGrid,
  AnimatedLineSeries,
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
  return (
    <Container py={5} maxW="container.lg">
      <Stack>
        <Heading>Träning från Polar</Heading>
        <Box>
          <ClientOnly>
            {() => (
              <XYChart
                height={300}
                xScale={{ type: "band" }}
                yScale={{ type: "linear" }}
              >
                <AnimatedAxis orientation="bottom" />
                <AnimatedGrid columns={false} numTicks={4} />
                {samples.map((sample) => (
                  <AnimatedLineSeries
                    key={sample.sampleType}
                    dataKey={sample.sampleType}
                    data={sample.samples.data.map((y, xDelta) => ({
                      y,
                      x: xDelta * sample.samples["recording-rate"],
                    }))}
                    xAccessor={(p) => p.x}
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
