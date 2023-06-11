import type { ExercisePurposeResolvers } from "~/graphql/generated/graphql";

export const exercisePurposeResolvers: ExercisePurposeResolvers = {
  label: (parent) => parent.label,
  shortLabel: (parent) => parent.shortLabel,
};
