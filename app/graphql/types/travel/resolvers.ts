import { DateTime } from "luxon";
import type { TravelResolvers } from "~/graphql/generated/graphql";

export const travelResolvers: TravelResolvers = {
  id: (parent) => parent.value.id,
  start: (parent) => DateTime.fromJSDate(parent.value.start),
  startDay: (parent) => ({ start: DateTime.fromJSDate(parent.value.start) }),
  end: (parent) => DateTime.fromJSDate(parent.value.end),
  title: () => `Resa`,
};
