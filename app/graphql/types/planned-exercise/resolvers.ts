import { DateTime } from "luxon";
import { db } from "~/db.server";
import type { PlannedExerciseResolvers } from "~/graphql/generated/graphql";

export const plannedExerciseResolvers: PlannedExerciseResolvers = {
  id: (parent) => parent.value.id,
  start: (parent) => DateTime.fromJSDate(parent.value.time),
  startDay: (parent, _, { timeZone }) => ({
    start: DateTime.fromJSDate(parent.value.time)
      .setZone(timeZone)
      .startOf("day"),
  }),
  title: () => "Planerad träning",
  primaryPurpose: (parent) =>
    parent.value.primaryPurposeId
      ? db.activityPurpose.findFirstOrThrow({
          where: { id: parent.value.primaryPurposeId },
        })
      : null,
  secondaryPurpose: (parent) =>
    parent.value.secondaryPurposeId
      ? db.activityPurpose.findFirstOrThrow({
          where: { id: parent.value.secondaryPurposeId },
        })
      : null,
  comment: (parent) => parent.value.comment,
  description: (parent) => parent.value.description,
};
