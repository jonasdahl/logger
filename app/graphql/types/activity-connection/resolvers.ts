import type { ActivityConnectionResolvers } from "~/graphql/generated/graphql";

export const activityConnectionResolvers: ActivityConnectionResolvers = {
  pageInfo: (parent) => parent.pageInfo,
  edges: (parent) => parent.edges,
};
