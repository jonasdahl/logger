import { DateTime } from "luxon";
import type { PlannedExerciseResolvers } from "~/graphql/generated/graphql";

export const plannedExerciseResolvers: PlannedExerciseResolvers = {
  id: (parent) => parent.value.id,
  start: (parent) => DateTime.fromJSDate(parent.value.time),
};
