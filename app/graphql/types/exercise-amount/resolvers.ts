import { ExerciseAmountType } from "@prisma/client";
import { db } from "~/db.server";
import type { ExerciseAmountResolvers } from "~/graphql/generated/graphql";

export const exerciseAmountResolvers: ExerciseAmountResolvers = {
  duration: async (loadAmount) =>
    loadAmount.amountType === ExerciseAmountType.Repetitions &&
    loadAmount.amountRepetitions
      ? {
          __typename: "ExerciseDurationRepetitions",
          repetitions: loadAmount.amountRepetitions,
        }
      : loadAmount.amountType === ExerciseAmountType.Time &&
        loadAmount.amountDurationMilliSeconds
      ? {
          __typename: "ExerciseDurationTime",
          durationSeconds: Number(loadAmount.amountDurationMilliSeconds) / 1000,
        }
      : loadAmount.amountType === ExerciseAmountType.Levels &&
        loadAmount.amountLevelId
      ? {
          __typename: "ExerciseDurationLevel",
          levelType: await db.exerciseTypeLevel.findFirstOrThrow({
            where: { id: loadAmount.amountLevelId },
          }),
        }
      : {
          __typename: "ExerciseDurationTime",
          durationSeconds: 0,
        },
  loads: (loadAmount) =>
    loadAmount.loads.map((load) => ({
      unit: load.exerciseLoadType.unit,
      value: load.amountValue,
      type: load.exerciseLoadType,
    })),
};
