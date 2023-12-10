import { orderBy } from "lodash";
import { DateTime } from "luxon";
import { z } from "zod";
import { db } from "~/db.server";
import type { DayResolvers } from "~/graphql/generated/graphql";

export const dayResolvers: DayResolvers = {
  start: (parent) => parent.start,
  date: (parent) => parent.start.toFormat("yyyy-MM-dd"),
  activities: async (parent, { includeHidden = true }, { userId }) => {
    const start = parent.start.startOf("day");
    const end = parent.start.endOf("day");

    if (!userId) {
      throw new Error("Not authenticated");
    }
    const customGames = await db.customGame.findMany({
      where: {
        userId,
        time: { gte: start.toJSDate(), lte: end.toJSDate() },
        deletedAt: null,
      },
    });
    const fogisGames = await db.fogisGame.findMany({
      where: {
        userId,
        time: { gte: start.toJSDate(), lte: end.toJSDate() },
        deletedAt: null,
      },
    });
    const activities = await db.activity.findMany({
      where: {
        userId,
        time: { gte: start.toJSDate(), lte: end.toJSDate() },
        deletedAt: null,
        isHiddenFromOverview: includeHidden ? undefined : false,
      },
    });
    const plannedActivities = await db.plannedActivity.findMany({
      where: {
        userId,
        time: { gte: start.toJSDate(), lte: end.toJSDate() },
        deletedAt: null,
      },
    });
    const physicalTests = await db.physicalTest.findMany({
      where: {
        userId,
        time: { gte: start.toJSDate(), lte: end.toJSDate() },
      },
    });
    return {
      pageInfo: {
        endCursor: null,
        hasNextPage: false,
        hasPreviousPage: false,
        startCursor: null,
      },
      edges: orderBy(
        [
          ...customGames.map((customGame) => ({
            cursor: customGame.id,
            node: { type: "CustomGame" as const, value: customGame },
          })),
          ...fogisGames.map((fogisGame) => ({
            cursor: fogisGame.id,
            node: { type: "FogisGame" as const, value: fogisGame },
          })),
          ...activities.map((activity) => ({
            cursor: activity.id,
            node: { type: "Exercise" as const, value: activity },
          })),
          ...plannedActivities.map((activity) => ({
            cursor: activity.id,
            node: { type: "PlannedExercise" as const, value: activity },
          })),
          ...physicalTests.map((physicalTest) => ({
            cursor: physicalTest.id,
            node: { type: "PhysicalTest" as const, value: physicalTest },
          })),
        ],
        (x) => x.node.value.time,
        "asc"
      ),
    };
  },
  heartRateSummary: async (parent, _, { userId }) => {
    if (!userId) {
      throw new Error("Not authenticated");
    }

    const polarExercises = await db.polarExercise.findMany({
      where: {
        userId: userId,
        startTime: {
          gte: parent.start.toJSDate(),
          lte: parent.start.endOf("day").toJSDate(),
        },
      },
    });

    const allSamples = polarExercises.flatMap((exercise) => {
      const samples = z
        .array(
          z.object({
            sampleType: z.string(),
            samples: z.object({
              "recording-rate": z.number(),
              data: z.array(z.string()),
            }),
          })
        )
        .parse(JSON.parse(exercise.samples ?? "[]"));
      return samples.map((samples) => ({ samples, exercise }));
    });

    const heartRateSamples = allSamples
      .flatMap((s) => (s.samples.sampleType === "0" ? [s] : []))
      .flatMap((s) =>
        s.samples.samples.data.map((x, i) => {
          const v = Number(x);
          if (!v || isNaN(v)) {
            return {
              value: null,
              durationSeconds: s.samples.samples["recording-rate"],
              tStart: DateTime.fromJSDate(s.exercise.startTime).plus({
                seconds: i * s.samples.samples["recording-rate"],
              }),
            };
          }
          return {
            value: v,
            durationSeconds: s.samples.samples["recording-rate"],
            tStart: DateTime.fromJSDate(s.exercise.startTime).plus({
              seconds: i * s.samples.samples["recording-rate"],
            }),
          };
        })
      );

    return { samples: heartRateSamples };
  },
};
