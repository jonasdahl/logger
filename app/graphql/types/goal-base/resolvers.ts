import { GoalType } from "@prisma/client";
import type { GoalBaseResolvers } from "~/graphql/generated/graphql";

export const goalBaseResolvers: GoalBaseResolvers = {
  __resolveType: (goal) => {
    switch (goal.type) {
      case GoalType.DayOfRest:
        return "GoalDayOfRest";
      case GoalType.DayOfWork:
        return "GoalDayOfWork";
      default:
        return "GoalGeneric";
    }
  },
  id: (goal) => goal.id,
  title: (goal) => goal.name,
  currentProgress: () => 0,
};
