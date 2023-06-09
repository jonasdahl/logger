import type { ActivityEdgeResolvers } from "~/graphql/generated/graphql";

export const activityEdgeResolvers: ActivityEdgeResolvers = {
  cursor: (parent) => parent.cursor,
  node: (parent) => parent.node,
};
