import { DateTime } from "luxon";
import type { PhysicalTestResolvers } from "~/graphql/generated/graphql";

export const physicalTestResolvers: PhysicalTestResolvers = {
  id: (parent) => parent.value.id,
  start: (parent) => DateTime.fromJSDate(parent.value.time),
  title: () => "Löptest",
  // isHiddenFromOverview: (parent) => parent.value.isHiddenFromOverview,
};
