import { DateTime } from "luxon";
import type { ActivityBaseResolvers } from "~/graphql/generated/graphql";

export const activityBaseResolvers: ActivityBaseResolvers = {
  id: (parent) => parent.value.id,
  start: (parent) =>
    parent.type === "Travel"
      ? DateTime.fromJSDate(parent.value.start)
      : DateTime.fromJSDate(parent.value.time),
  startDay: (parent, _, { timeZone }) => {
    return {
      start: (parent.type === "Travel"
        ? DateTime.fromJSDate(parent.value.start)
        : DateTime.fromJSDate(parent.value.time)
      )
        .setZone(timeZone)
        .startOf("day"),
    };
  },
  title: () => {
    throw new Error("Resolver not implemented");
  },
  __resolveType: (parent) => parent.type,
};
