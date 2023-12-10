import type { ExerciseDurationResolvers } from "~/graphql/generated/graphql";

export const exerciseDurationResolvers: ExerciseDurationResolvers = {
  __resolveType: (parent) => parent.__typename!,
};
