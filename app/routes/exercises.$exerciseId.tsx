import {
  Code,
  Container,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import type { LoaderArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { z } from "zod";
import { getSessionFromRequest } from "~/session.server";

enum PolarSampleType {
  HeartRateBPM = 0,
  SpeedKmH = 1,
  CadenceRPM = 2,
  AltitudeM = 3,
  PowerW = 4,
  PowerPedalingIndexPerCent = 5,
  PowerLeftRightBalancePerCent = 6,
  AirPressureHpa = 7,
  RunningCadenceSpm = 8,
  TemperatureDegreesCelsius = 9,
  DistanceM = 10,
  RRIntervalMs = 11,
}

const sampleTypeType = z.nativeEnum(PolarSampleType);

const sampleType = z.object({
  // Interval in seconds between samples
  recording_rate: z.number(),

  sample_type: sampleTypeType,

  data: z
    .string()
    .transform((s) =>
      s.split(",").map((x) => (x === "null" ? null : Number(x)))
    ),
});

export async function loader({ request, params }: LoaderArgs) {
  const { exerciseId } = z.object({ exerciseId: z.string() }).parse(params);

  const session = await getSessionFromRequest(request);
  const polarUserId = session.get("polarUserId");
  const polarAccessToken = session.get("polarAccessToken");

  if (!polarUserId || !polarAccessToken) {
    throw redirect("/");
  }

  const res = await fetch(
    `https://www.polaraccesslink.com/v3/exercises/${exerciseId}?samples=true&zones=true`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${polarAccessToken}`,
        Accept: "application/json",
      },
    }
  );

  if (res.status === 401) {
    return redirect("/auth/polar");
  }

  if (res.status === 403) {
    throw new Response(undefined, { status: 403 });
  }

  if (!res.ok) {
    throw new Error(
      `Invalid response: ${res.status} ${res.statusText} ${await res.text()}`
    );
  }

  const data = await res.json();
  const exercise = z.object({ samples: z.array(sampleType) }).parse(data);

  return json({ exercise, data });
}

export default function Index() {
  const { exercise, data: rawData } = useLoaderData<typeof loader>();

  const heartRateSample = exercise.samples.find(
    (s) => s.sample_type === PolarSampleType.HeartRateBPM
  );

  if (!heartRateSample) {
    throw new Error("No heart rate sample found");
  }

  const maxPulse = 198;

  const intervals = [60, 76, 86, 94, 100]
    .map((maxRelative, i, arr) => ({
      zone: i + 1,
      maxRelative: maxRelative / 100,
      minRelative: (arr[i - 1] || 0) / 100,
    }))
    .map(({ minRelative, maxRelative, zone }) => ({
      zone,
      minRelative,
      maxRelative,
      min: minRelative * maxPulse,
      max: maxRelative * maxPulse,
    }));
  const data = intervals.map(({ max, min, maxRelative, minRelative, zone }) => {
    return {
      zone,
      max,
      min,
      maxRelative,
      minRelative,
      seconds: heartRateSample.data.filter(
        (x) => x !== null && x <= max && x > min
      ).length,
    };
  });
  const total = heartRateSample.data.filter((x) => x !== null).length;
  const errors = heartRateSample.data.filter((x) => x === null).length;

  return (
    <Container>
      <TableContainer>
        <Table size="sm">
          <Thead>
            <Tr>
              <Th>Zon</Th>
              <Th>Relativ puls</Th>
              <Th>Puls</Th>
              <Th>Antal sekunder</Th>
              <Th>Antal minuter</Th>
              <Th>Andel</Th>
            </Tr>
          </Thead>

          <Tbody>
            {data.map(
              ({ zone, max, min, maxRelative, minRelative, seconds }) => (
                <Tr key={max}>
                  <Td>{zone}</Td>
                  <Td>
                    {(minRelative * 100).toLocaleString("sv-SE", {
                      maximumFractionDigits: 0,
                      unit: "percent",
                      style: "unit",
                    })}{" "}
                    till{" "}
                    {(maxRelative * 100 - 1).toLocaleString("sv-SE", {
                      maximumFractionDigits: 0,
                      unit: "percent",
                      style: "unit",
                    })}
                  </Td>
                  <Td>
                    {min.toLocaleString("sv-SE", {
                      maximumFractionDigits: 0,
                    })}{" "}
                    till{" "}
                    {max.toLocaleString("sv-SE", {
                      maximumFractionDigits: 0,
                    })}
                  </Td>
                  <Td>
                    {seconds.toLocaleString("sv-SE", {
                      maximumFractionDigits: 0,
                    })}
                  </Td>
                  <Td>
                    {(seconds / 60).toLocaleString("sv-SE", {
                      maximumFractionDigits: 0,
                    })}
                  </Td>
                  <Td>
                    {((seconds / total) * 100).toLocaleString("sv-SE", {
                      maximumFractionDigits: 0,
                      unit: "percent",
                      style: "unit",
                    })}
                  </Td>
                </Tr>
              )
            )}
          </Tbody>
        </Table>
      </TableContainer>
      <Code as="pre">{JSON.stringify(rawData, null, 4)}</Code>
    </Container>
  );
}
