import type { ExerciseTypeResolvers } from "~/graphql/generated/graphql";

export const exerciseTypeResolvers: ExerciseTypeResolvers = {
  id: (parent) => parent.id,
  name: (parent) => parent.name,
};
