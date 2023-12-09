import type { ExerciseTypeEdgeResolvers } from "~/graphql/generated/graphql";

export const exerciseTypeEdgeResolvers: ExerciseTypeEdgeResolvers = {
  cursor: (parent) => parent.cursor,
  node: (parent) => parent.node,
};
