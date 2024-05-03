import type { ActivityGameResolvers } from "~/graphql/generated/graphql";

export const activityGameResolvers: ActivityGameResolvers = {
  __resolveType: (parent) => parent.type,
  id: (parent) => parent.value.id,
};
