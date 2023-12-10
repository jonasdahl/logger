import type { ExerciseAmountResolvers } from "~/graphql/generated/graphql";

export const exerciseAmountResolvers: ExerciseAmountResolvers = {
  duration: (parent) => parent.duration,
  loads: (parent) => parent.loads,
};
