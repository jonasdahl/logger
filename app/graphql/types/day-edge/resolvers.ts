import type { DayEdgeResolvers } from "~/graphql/generated/graphql";

export const dayEdgeResolvers: DayEdgeResolvers = {
  cursor: (parent) => parent.cursor,
  node: (parent) => parent.node,
};
