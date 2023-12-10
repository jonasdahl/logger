import type { ExerciseLoadResolvers } from "~/graphql/generated/graphql";

export const exerciseLoadResolvers: ExerciseLoadResolvers = {
  unit: (parent) => parent.unit,
  value: (parent) => parent.value,
  type: (parent) => parent.type,
};
