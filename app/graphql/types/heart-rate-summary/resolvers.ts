import { Interval } from "luxon";
import { sum } from "remeda";
import { db } from "~/db.server";
import {
  HeartRateZone,
  type HeartRateSummaryResolvers,
} from "~/graphql/generated/graphql";

const zoneDefinitions = [
  { zone: HeartRateZone.Zone1, max: 59.999 },
  { zone: HeartRateZone.Zone2, max: 75.999 },
  { zone: HeartRateZone.Zone3, max: 85.999 },
  { zone: HeartRateZone.Zone4, max: 93.999 },
  { zone: HeartRateZone.Zone5, max: 100 },
];

export const heartRateSummaryResolvers: HeartRateSummaryResolvers = {
  samples: (parent, _, { timeZone }) => {
    console.log(parent);
    const fullInterval = Interval.fromDateTimes(parent.start, parent.end);
    return fullInterval.splitBy({ seconds: 5 }).map((interval) => {
      const intervalSamples = parent.samples
        .filter((s) =>
          interval.intersection(
            Interval.fromDateTimes(
              s.tStart,
              s.tStart.plus({ seconds: s.durationSeconds })
            )
          )
        )
        .filter((x) => x.value !== null);
      return {
        heartRate:
          intervalSamples.length === 0
            ? null
            : sum(intervalSamples.map((s) => s.value!)) /
              intervalSamples.length,
        time: interval.start!,
      };
    });
  },
  secondsInZone: async (parent, { heartRateZone }, { userId }) => {
    if (!userId) {
      throw new Error("Unauthorized");
    }
    const { maxPulse: maxHeartRate } = await db.user.findUniqueOrThrow({
      where: { id: userId },
    });

    if (!maxHeartRate) {
      throw new Error("No max heart rate configured");
    }

    const zones = zoneDefinitions
      .map(({ zone, max }) => ({
        zone,
        maxRelative: max,
        maxAbsolute: maxHeartRate * (max / 100),
      }))
      .map((x, i, arr) => ({
        ...x,
        minAbsolute: arr[i - 1]?.maxAbsolute ?? 0,
        minRelative: arr[i - 1]?.maxRelative ?? 0,
      }));

    const heartRateZones = zones.map((zone, i, arr) => ({
      zone,
      samples: parent.samples.filter(
        (s) =>
          s.value !== null &&
          zone.maxAbsolute !== null &&
          s.value <= zone.maxAbsolute &&
          !arr.filter((_, j) => j < i).some((z) => s.value! <= z.maxAbsolute!)
      ),
    }));

    const zone = heartRateZones.find(
      (zone) => zone.zone.zone === heartRateZone
    );
    if (!zone) {
      return null;
    }
    return sum(zone.samples.map((s) => s.durationSeconds));
  },
};
