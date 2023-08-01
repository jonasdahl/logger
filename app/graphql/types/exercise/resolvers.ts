import { DateTime } from "luxon";
import { db } from "~/db.server";
import type { ExerciseResolvers } from "~/graphql/generated/graphql";

export const exerciseResolvers: ExerciseResolvers = {
  id: (parent) => parent.value.id,
  start: (parent) => DateTime.fromJSDate(parent.value.time),
  title: () => "Registrerad träning",
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
  isHiddenFromOverview: (parent) => parent.value.isHiddenFromOverview,
  comment: (parent) => parent.value.comment,
  description: (parent) => parent.value.description,
};
