import type { ExerciseItemEdgeResolvers } from "~/graphql/generated/graphql";

export const exerciseItemEdgeResolvers: ExerciseItemEdgeResolvers = {
  cursor: (parent) => parent.cursor,
  node: (parent) => parent.node,
};
