import { DateTime } from "luxon";
import type { ActivityBaseResolvers } from "~/graphql/generated/graphql";

export const activityBaseResolvers: ActivityBaseResolvers = {
  id: (parent) => parent.value.id,
  start: (parent) => DateTime.fromJSDate(parent.value.time),
  title: (parent) => {
    throw new Error("Resolver not implemented");
  },
  __resolveType: (parent) => parent.type,
};
