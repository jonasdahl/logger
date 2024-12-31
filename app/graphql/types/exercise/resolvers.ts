import { DateTime } from "luxon";
import { z } from "zod";
import { db } from "~/db.server";
import type { ExerciseResolvers } from "~/graphql/generated/graphql";

export const exerciseResolvers: ExerciseResolvers = {
  id: (parent) => parent.value.id,
  start: (parent) => DateTime.fromJSDate(parent.value.time),
  startDay: (parent, _, { timeZone }) => ({
    start: DateTime.fromJSDate(parent.value.time)
      .setZone(timeZone)
      .startOf("day"),
  }),
  title: () => "Registrerad träning",
  primaryPurpose: (parent) =>
    parent.value.primaryPurposeId
      ? db.activityPurpose.findFirstOrThrow({
          where: { id: parent.value.primaryPurposeId },
        })
      : null,
  fromPlannedActivity: async (parent) => {
    if (parent.value.fromPlannedActivityId) {
      return {
        type: "PlannedExercise",
        value: await db.plannedActivity.findFirstOrThrow({
          where: { id: parent.value.fromPlannedActivityId },
        }),
      };
    }
    return null;
  },
  secondaryPurpose: (parent) =>
    parent.value.secondaryPurposeId
      ? db.activityPurpose.findFirstOrThrow({
          where: { id: parent.value.secondaryPurposeId },
        })
      : null,
  isHiddenFromOverview: (parent) => parent.value.isHiddenFromOverview,
  comment: (parent) => parent.value.comment,
  description: (parent) => parent.value.description,
  items: async (parent) => {
    const exerciseItems = await db.exerciseItem.findMany({
      where: { activityId: parent.value.id, deletedAt: null },
      orderBy: { order: "asc" },
    });
    return {
      edges: exerciseItems.map((exerciseItem) => ({
        cursor: exerciseItem.id,
        node: exerciseItem,
      })),
      pageInfo: {
        hasNextPage: false,
        hasPreviousPage: false,
        startCursor: exerciseItems[0]?.id ?? null,
        endCursor: exerciseItems[exerciseItems.length - 1]?.id ?? null,
      },
    };
  },
  heartRateSummary: async (parent, _, { userId }) => {
    if (!userId) throw new Error("Unauthorized");
    const exerciseStart = DateTime.fromJSDate(parent.value.time);
    const exerciseEnd = parent.value.endedAt
      ? DateTime.fromJSDate(parent.value.endedAt)
      : null;
    const polarExercises = await db.polarExercise.findMany({
      where: {
        userId: userId,
        startTime: {
          gte: exerciseStart.startOf("day").toJSDate(),
          lte: exerciseStart.endOf("day").toJSDate(),
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

    return {
      start: DateTime.min(
        exerciseStart,
        ...polarExercises.map((e) => DateTime.fromJSDate(e.startTime))
      ),
      end: DateTime.max(
        ...[
          exerciseStart.plus({ hours: 2 }),
          exerciseEnd,
          ...polarExercises.map((e) =>
            DateTime.fromJSDate(e.startTime).plus({ hours: 2 })
          ),
        ].filter(Boolean)
      ),
      samples: heartRateSamples,
    };
  },
};
