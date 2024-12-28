import type { Goal } from "@prisma/client";
import { DateTime } from "luxon";
import { clamp } from "remeda";
import { db } from "~/db.server";
import type { GoalDayOfRestResolvers } from "~/graphql/generated/graphql";
import { goalBaseResolvers } from "../goal-base/resolvers";
import { getGoalIntervalDays } from "../goal/utils";

async function getDayCount(goal: Goal, time: DateTime, userId: string) {
  const daysInPeriod = getGoalIntervalDays(goal, time).filter(
    // A day is considered "rest day" if it is in the past and there are no activities
    (day) => day.start! < time.startOf("day")
  );

  const activities = await db.activity.findMany({
    where: { userId, deletedAt: null },
  });

  const daysOfRest = daysInPeriod.filter((day) => {
    return !activities.some((activity) => {
      const activityTime = DateTime.fromJSDate(activity.time);
      return day.contains(activityTime);
    });
  });

  return daysOfRest.length;
}

export const goalDayOfRestResolvers: GoalDayOfRestResolvers = {
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
        (goal.typeDayOfRestNumberOfDays || 0) || 0
    );
  },
  currentDaysOfRest: (goal, _, { timeZone, userId }) => {
    if (!userId) {
      throw new Error("Unauthorized");
    }
    return getDayCount(goal, DateTime.now().setZone(timeZone), userId);
  },
};
