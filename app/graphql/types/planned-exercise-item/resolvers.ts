import { db } from "~/db.server";
import { type PlannedExerciseItemResolvers } from "~/graphql/generated/graphql";

export const plannedExerciseItemResolvers: PlannedExerciseItemResolvers = {
  id: (parent) => parent.id,
  plannedExercise: async (parent, __, { userId }) => {
    const activity = await db.plannedActivity.findFirstOrThrow({
      where: { id: parent.plannedActivityId, userId: userId! },
    });
    return { type: "PlannedExercise", value: activity };
  },
  exerciseType: (parent) =>
    parent.typeExerciseExerciseTypeId
      ? db.exerciseType.findUniqueOrThrow({
          where: { id: parent.typeExerciseExerciseTypeId },
        })
      : null,
};
