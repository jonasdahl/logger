import type { Goal } from "@prisma/client";
import { DateTime } from "luxon";
import { clamp } from "remeda";
import { db } from "~/db.server";
import type { GoalPerformExerciseTypeResolvers } from "~/graphql/generated/graphql";
import { goalBaseResolvers } from "../goal-base/resolvers";
import { getGoalIntervalDays } from "../goal/utils";

async function getDayCount(userId: string, goal: Goal, timeZone: string) {
  if (!goal.typePerformExerciseTypeExerciseTypeId) {
    throw new Error("Missing exercise type");
  }

  const currentIntervalDays = getGoalIntervalDays(
    goal,
    DateTime.now().setZone(timeZone)
  );

  const activities = await db.activity.findMany({
    where: { userId, deletedAt: null },
    include: {
      exerciseItems: {
        where: {
          exerciseTypeId: goal.typePerformExerciseTypeExerciseTypeId,
          deletedAt: null,
        },
      },
    },
  });

  const daysWithExercise = currentIntervalDays.filter((day) => {
    return activities.some((activity) => {
      const activityTime = DateTime.fromJSDate(activity.time);
      return day.contains(activityTime) && activity.exerciseItems.length > 0;
    });
  });

  return daysWithExercise.length;
}

export const goalPerformExerciseTypeResolvers: GoalPerformExerciseTypeResolvers =
  {
    id: goalBaseResolvers.id,
    title: goalBaseResolvers.title,
    currentPeriodEnd: goalBaseResolvers.currentPeriodEnd,
    currentPeriodStart: goalBaseResolvers.currentPeriodStart,
    currentProgress: async (goal, _, { userId, timeZone }) => {
      if (!userId) {
        throw new Error("Unauthorized");
      }
      return clamp({ min: 0, max: 1 })(
        (await getDayCount(userId, goal, timeZone)) /
          (goal.typePerformExerciseTypeNumberOfDays || 0) || 0
      );
    },
    currentDayCount: async (goal, _, { userId, timeZone }) => {
      if (!userId) {
        throw new Error("Unauthorized");
      }
      return getDayCount(userId, goal, timeZone);
    },
  };
