import { DateTime } from "luxon";
import { clamp } from "remeda";
import { db } from "~/db.server";
import type { GoalDayOfWorkResolvers } from "~/graphql/generated/graphql";
import { goalBaseResolvers } from "../goal-base/resolvers";
import { getGoalIntervalDays } from "../goal/utils";

export const goalDayOfWorkResolvers: GoalDayOfWorkResolvers = {
  id: goalBaseResolvers.id,
  title: goalBaseResolvers.title,
  currentProgress: async (goal, _, { userId }) => {
    if (!userId) {
      throw new Error("Unauthorized");
    }
    const daysInPeriod = getGoalIntervalDays(goal, DateTime.now());

    const activities = await db.activity.findMany({
      where: { userId, deletedAt: null },
    });

    const daysOfWork = daysInPeriod.filter((day) => {
      return activities.some((activity) => {
        const activityTime = DateTime.fromJSDate(activity.time);
        return day.contains(activityTime);
      });
    });

    return clamp({ min: 0, max: 1 })(
      daysOfWork.length / (goal.typeDayOfWorkNumberOfDays || 0) || 0
    );
  },
};
