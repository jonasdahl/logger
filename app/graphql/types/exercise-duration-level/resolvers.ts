import type { ExerciseDurationLevelResolvers } from "~/graphql/generated/graphql";

export const exerciseDurationLevelResolvers: ExerciseDurationLevelResolvers = {
  levelType: (parent) => parent.levelType,
};
