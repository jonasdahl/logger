import type { ExerciseDurationRepetitionsResolvers } from "~/graphql/generated/graphql";

export const exerciseDurationRepetitionsResolvers: ExerciseDurationRepetitionsResolvers =
  {
    repetitions: (parent) => parent.repetitions,
  };
