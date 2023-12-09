import { db } from "~/db.server";
import type { ExerciseItemResolvers } from "~/graphql/generated/graphql";

export const exerciseItemResolvers: ExerciseItemResolvers = {
  id: (parent) => parent.id,
  exercise: async (parent, __, { userId }) => {
    const activity = await db.activity.findFirstOrThrow({
      where: { id: parent.activityId, userId: userId! },
    });
    return { type: "Exercise", value: activity };
  },
  exerciseType: (parent) =>
    db.exerciseType.findUniqueOrThrow({ where: { id: parent.exerciseTypeId } }),
};
