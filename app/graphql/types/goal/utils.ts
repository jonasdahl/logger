import type { Goal } from "@prisma/client";
import { GoalTimeType } from "@prisma/client";
import type { DateTime } from "luxon";
import { Interval } from "luxon";

export const getGoalInterval = (goal: Goal, time: DateTime) => {
  switch (goal.timeType) {
    case GoalTimeType.EveryCalendarMonth:
      return Interval.fromDateTimes(time.startOf("month"), time.endOf("month"));
    case GoalTimeType.EveryCalendarWeek:
      return Interval.fromDateTimes(time.startOf("week"), time.endOf("week"));
    case GoalTimeType.EveryCalendarYear:
      return Interval.fromDateTimes(time.startOf("year"), time.endOf("year"));
    case GoalTimeType.EveryRollingNumberOfDays:
      return Interval.fromDateTimes(
        time
          .minus({
            days: goal.timeTypeEveryRollingNumberOfDaysAmount || 1,
          })
          .startOf("day"),
        time.endOf("day")
      );
    default:
      return Interval.fromDateTimes(time.startOf("day"), time.endOf("day"));
  }
};

export const getGoalIntervalDays = (goal: Goal, time: DateTime) => {
  return getGoalInterval(goal, time).splitBy({ days: 1 });
};
