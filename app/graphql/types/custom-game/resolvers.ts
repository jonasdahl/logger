import { DateTime } from "luxon";
import type { CustomGameResolvers } from "~/graphql/generated/graphql";

export const customGameResolvers: CustomGameResolvers = {
  id: (parent) => parent.value.id,
  start: (parent) => DateTime.fromJSDate(parent.value.time),
  startDay: (parent) => ({ start: DateTime.fromJSDate(parent.value.time) }),
  title: (parent) => `Match`,
};
