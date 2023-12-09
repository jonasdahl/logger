import { ExerciseItemConnectionResolvers } from "~/graphql/generated/graphql";

export const exerciseItemConnectionResolvers: ExerciseItemConnectionResolvers =
  {
    pageInfo: (parent) => parent.pageInfo,
    edges: (parent) => parent.edges,
  };
