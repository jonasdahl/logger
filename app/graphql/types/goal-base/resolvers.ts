import { GoalType } from "@prisma/client";
import { DateTime } from "luxon";
import type { GoalBaseResolvers } from "~/graphql/generated/graphql";
import { getGoalInterval } from "../goal/utils";

export const goalBaseResolvers: GoalBaseResolvers = {
  __resolveType: (goal) => {
    switch (goal.type) {
      case GoalType.DayOfRest:
        return "GoalDayOfRest";
      case GoalType.DayOfWork:
        return "GoalDayOfWork";
      case GoalType.PerformExerciseType:
        return "GoalPerformExerciseType";
      default:
        return "GoalGeneric";
    }
  },
  id: (goal) => goal.id,
  title: (goal) => goal.name,
  currentProgress: () => null,
  currentPeriodEnd: (goal, _, { timeZone }) =>
    getGoalInterval(goal, DateTime.now().setZone(timeZone)).end!,
  currentPeriodStart: (goal, _, { timeZone }) =>
    getGoalInterval(goal, DateTime.now().setZone(timeZone)).start!,
};
