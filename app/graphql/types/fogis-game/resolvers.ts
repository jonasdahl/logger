import { DateTime } from "luxon";
import type { FogisGameResolvers } from "~/graphql/generated/graphql";

export const fogisGameResolvers: FogisGameResolvers = {
  id: (parent) => parent.value.id,
  homeTeam: (parent) => parent.value.homeTeam,
  awayTeam: (parent) => parent.value.awayTeam,
  start: (parent) => DateTime.fromJSDate(parent.value.time),
};
