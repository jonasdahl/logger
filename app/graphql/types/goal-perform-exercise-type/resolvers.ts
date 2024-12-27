import { DateTime } from "luxon";
import { clamp } from "remeda";
import { db } from "~/db.server";
import type { GoalPerformExerciseTypeResolvers } from "~/graphql/generated/graphql";
import { goalBaseResolvers } from "../goal-base/resolvers";
import { getGoalIntervalDays } from "../goal/utils";

export const goalPerformExerciseTypeResolvers: GoalPerformExerciseTypeResolvers =
  {
    id: goalBaseResolvers.id,
    title: goalBaseResolvers.title,
    currentProgress: async (goal, _, { userId }) => {
      if (!userId) {
        throw new Error("Unauthorized");
      }
      if (!goal.typePerformExerciseTypeExerciseTypeId) {
        throw new Error("Missing exercise type");
      }
      const currentIntervalDays = getGoalIntervalDays(goal, DateTime.now());

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
          return (
            day.contains(activityTime) && activity.exerciseItems.length > 0
          );
        });
      });

      console.log(
        "daysWithExercise",
        daysWithExercise.map((d) => d.toISO())
      );

      return clamp({ min: 0, max: 1 })(
        daysWithExercise.length /
          (goal.typePerformExerciseTypeNumberOfDays || 0) || 0
      );
    },
  };
