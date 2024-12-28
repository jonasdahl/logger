import { DateTime } from "luxon";
import { clamp } from "remeda";
import { db } from "~/db.server";
import type { GoalDayOfRestResolvers } from "~/graphql/generated/graphql";
import { goalBaseResolvers } from "../goal-base/resolvers";
import { getGoalIntervalDays } from "../goal/utils";

export const goalDayOfRestResolvers: GoalDayOfRestResolvers = {
  id: goalBaseResolvers.id,
  title: goalBaseResolvers.title,
  currentPeriodEnd: goalBaseResolvers.currentPeriodEnd,
  currentPeriodStart: goalBaseResolvers.currentPeriodStart,
  currentProgress: async (goal, _, { userId, timeZone }) => {
    if (!userId) {
      throw new Error("Unauthorized");
    }
    const daysInPeriod = getGoalIntervalDays(
      goal,
      DateTime.now().setZone(timeZone)
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

    return clamp({ min: 0, max: 1 })(
      daysOfRest.length / (goal.typeDayOfRestNumberOfDays || 0) || 0
    );
  },
};
