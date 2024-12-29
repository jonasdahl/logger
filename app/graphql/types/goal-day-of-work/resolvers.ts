import type { Goal } from "@prisma/client";
import { DateTime } from "luxon";
import { clamp } from "remeda";
import { db } from "~/db.server";
import type { GoalDayOfWorkResolvers } from "~/graphql/generated/graphql";
import { goalBaseResolvers } from "../goal-base/resolvers";
import { getGoalIntervalDays } from "../goal/utils";

async function getDayCount(goal: Goal, time: DateTime, userId: string) {
  const daysInPeriod = getGoalIntervalDays(goal, time);

  const activities = await db.activity.findMany({
    where: { userId, deletedAt: null },
  });

  const daysOfWork = daysInPeriod.filter((day) => {
    return activities.some((activity) => {
      const activityTime = DateTime.fromJSDate(activity.time);
      return day.contains(activityTime);
    });
  });

  return daysOfWork.length;
}

export const goalDayOfWorkResolvers: GoalDayOfWorkResolvers = {
  id: goalBaseResolvers.id,
  title: goalBaseResolvers.title,
  currentPeriodEnd: goalBaseResolvers.currentPeriodEnd,
  currentPeriodStart: goalBaseResolvers.currentPeriodStart,
  currentProgress: async (goal, _, { userId, timeZone }) => {
    if (!userId) {
      throw new Error("Unauthorized");
    }
    return clamp({ min: 0, max: 1 })(
      (await getDayCount(goal, DateTime.now().setZone(timeZone), userId)) /
        (goal.typeDayOfWorkNumberOfDays || 0) || 0
    );
  },
  currentDaysOfWork: (goal, _, { timeZone, userId }) => {
    if (!userId) {
      throw new Error("Unauthorized");
    }
    return getDayCount(goal, DateTime.now().setZone(timeZone), userId);
  },
  targetDaysOfWork: (goal) => goal.typeDayOfWorkNumberOfDays || 0,
};
