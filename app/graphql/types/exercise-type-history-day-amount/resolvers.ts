import { type ExerciseTypeHistoryDayAmountResolvers } from "~/graphql/generated/graphql";

export const exerciseTypeHistoryDayAmountResolvers: ExerciseTypeHistoryDayAmountResolvers =
  {
    dayStart: (parent) => parent.dayStart,
    dayAmounts: (parent) => parent.loadAmounts,
  };
