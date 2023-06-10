import type { DayConnectionResolvers } from "~/graphql/generated/graphql";

export const dayConnectionResolvers: DayConnectionResolvers = {
  pageInfo: (parent) => parent.pageInfo,
  edges: (parent) => parent.edges,
};
