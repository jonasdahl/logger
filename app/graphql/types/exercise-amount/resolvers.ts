import { ExerciseAmountType } from "@prisma/client";
import type { ExerciseAmountResolvers } from "~/graphql/generated/graphql";

export const exerciseAmountResolvers: ExerciseAmountResolvers = {
  duration: (loadAmount) =>
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
