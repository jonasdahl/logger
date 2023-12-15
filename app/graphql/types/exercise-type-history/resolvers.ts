import { type ExerciseTypeHistoryResolvers } from "~/graphql/generated/graphql";

export const exerciseTypeHistoryResolvers: ExerciseTypeHistoryResolvers = {
  name: (parent) => parent.name,
};
