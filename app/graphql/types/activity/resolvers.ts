import type { ActivityResolvers } from "~/graphql/generated/graphql";

export const activityResolvers: ActivityResolvers = {
  __resolveType: (activity) => activity.type,
};
