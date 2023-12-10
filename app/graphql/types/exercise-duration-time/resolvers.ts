import type { ExerciseDurationTimeResolvers } from "~/graphql/generated/graphql";

export const exerciseDurationTimeResolvers: ExerciseDurationTimeResolvers = {
  durationSeconds: (parent) => parent.durationSeconds,
};
