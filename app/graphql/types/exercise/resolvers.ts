import { DateTime } from "luxon";
import type { ExerciseResolvers } from "~/graphql/generated/graphql";

export const exerciseResolvers: ExerciseResolvers = {
  id: (parent) => parent.value.id,
  start: (parent) => DateTime.fromJSDate(parent.value.time),
};
