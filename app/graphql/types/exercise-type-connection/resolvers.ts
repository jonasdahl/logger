import type { ExerciseTypeConnectionResolvers } from "~/graphql/generated/graphql";

export const exerciseTypeConnectionResolvers: ExerciseTypeConnectionResolvers =
  {
    pageInfo: (parent) => parent.pageInfo,
    edges: (parent) => parent.edges,
  };
