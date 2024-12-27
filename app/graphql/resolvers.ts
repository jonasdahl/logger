import type { Resolvers } from "./generated/graphql";
import { dateTimeScalar } from "./scalars/date-time/scalar";
import { activityBaseResolvers } from "./types/activity-base/resolvers";
import { activityConnectionResolvers } from "./types/activity-connection/resolvers";
import { activityEdgeResolvers } from "./types/activity-edge/resolvers";
import { activityGameResolvers } from "./types/activity-game/resolvers";
import { activityResolvers } from "./types/activity/resolvers";
import { categoryTagResolvers } from "./types/category-tag/resolvers";
import { customGameResolvers } from "./types/custom-game/resolvers";
import { dayConnectionResolvers } from "./types/day-connection/resolvers";
import { dayEdgeResolvers } from "./types/day-edge/resolvers";
import { dayResolvers } from "./types/day/resolvers";
import { eventResolvers } from "./types/event/resolvers";
import { exerciseAmountResolvers } from "./types/exercise-amount/resolvers";
import { exerciseDurationLevelResolvers } from "./types/exercise-duration-level/resolvers";
import { exerciseDurationRepetitionsResolvers } from "./types/exercise-duration-repetitions/resolvers";
import { exerciseDurationTimeResolvers } from "./types/exercise-duration-time/resolvers";
import { exerciseDurationResolvers } from "./types/exercise-duration/resolvers";
import { exerciseItemConnectionResolvers } from "./types/exercise-item-connection/resolvers";
import { exerciseItemEdgeResolvers } from "./types/exercise-item-edge/resolvers";
import { exerciseItemResolvers } from "./types/exercise-item/resolvers";
import { exerciseLoadTypeResolvers } from "./types/exercise-load-type/resolvers";
import { exerciseLoadResolvers } from "./types/exercise-load/resolvers";
import { exercisePurposeResolvers } from "./types/exercise-purpose/resolvers";
import { exerciseTypeConnectionResolvers } from "./types/exercise-type-connection/resolvers";
import { exerciseTypeEdgeResolvers } from "./types/exercise-type-edge/resolvers";
import { exerciseTypeHistoryDayAmountResolvers } from "./types/exercise-type-history-day-amount/resolvers";
import { exerciseTypeHistoryResolvers } from "./types/exercise-type-history/resolvers";
import { exerciseTypeLevelResolvers } from "./types/exercise-type-level/resolvers";
import { exerciseTypeResolvers } from "./types/exercise-type/resolvers";
import { exerciseResolvers } from "./types/exercise/resolvers";
import { fogisGameResolvers } from "./types/fogis-game/resolvers";
import { goalBaseResolvers } from "./types/goal-base/resolvers";
import { goalDayOfRestResolvers } from "./types/goal-day-of-rest/resolvers";
import { goalDayOfWorkResolvers } from "./types/goal-day-of-work/resolvers";
import { goalGenericResolvers } from "./types/goal-generic/resolvers";
import { goalPerformExerciseTypeResolvers } from "./types/goal-perform-exercise-type/resolvers";
import { goalResolvers } from "./types/goal/resolvers";
import { heartRateSampleResolvers } from "./types/heart-rate-sample/resolvers";
import { heartRateSummaryResolvers } from "./types/heart-rate-summary/resolvers";
import { pageInfoResolvers } from "./types/page-info/resolvers";
import { physicalTestResolvers } from "./types/physical-test/resolvers";
import { plannedExerciseResolvers } from "./types/planned-exercise/resolvers";
import { queryResolvers } from "./types/query/resolvers";
import { travelResolvers } from "./types/travel/resolvers";
import { userResolvers } from "./types/user/resolvers";

export const resolvers: Resolvers = {
  Query: queryResolvers,
  User: userResolvers,
  Activity: activityResolvers,
  PageInfo: pageInfoResolvers,
  ActivityConnection: activityConnectionResolvers,
  ActivityEdge: activityEdgeResolvers,
  Exercise: exerciseResolvers,
  FogisGame: fogisGameResolvers,
  ActivityBase: activityBaseResolvers,
  DateTime: dateTimeScalar,
  Day: dayResolvers,
  DayConnection: dayConnectionResolvers,
  DayEdge: dayEdgeResolvers,
  PlannedExercise: plannedExerciseResolvers,
  ExercisePurpose: exercisePurposeResolvers,
  PhysicalTest: physicalTestResolvers,
  HeartRateSummary: heartRateSummaryResolvers,
  ExerciseType: exerciseTypeResolvers,
  ExerciseTypeConnection: exerciseTypeConnectionResolvers,
  ExerciseTypeEdge: exerciseTypeEdgeResolvers,
  ExerciseItem: exerciseItemResolvers,
  ExerciseItemConnection: exerciseItemConnectionResolvers,
  ExerciseItemEdge: exerciseItemEdgeResolvers,
  ExerciseAmount: exerciseAmountResolvers,
  ExerciseDuration: exerciseDurationResolvers,
  ExerciseDurationRepetitions: exerciseDurationRepetitionsResolvers,
  ExerciseDurationTime: exerciseDurationTimeResolvers,
  ExerciseLoad: exerciseLoadResolvers,
  ExerciseLoadType: exerciseLoadTypeResolvers,
  CustomGame: customGameResolvers,
  ExerciseTypeHistory: exerciseTypeHistoryResolvers,
  ExerciseTypeHistoryDayAmount: exerciseTypeHistoryDayAmountResolvers,
  ExerciseTypeLevel: exerciseTypeLevelResolvers,
  ExerciseDurationLevel: exerciseDurationLevelResolvers,
  Travel: travelResolvers,
  ActivityGame: activityGameResolvers,
  Event: eventResolvers,
  HeartRateSample: heartRateSampleResolvers,
  CategoryTag: categoryTagResolvers,
  Goal: goalResolvers,
  GoalBase: goalBaseResolvers,
  GoalDayOfRest: goalDayOfRestResolvers,
  GoalGeneric: goalGenericResolvers,
  GoalDayOfWork: goalDayOfWorkResolvers,
  GoalPerformExerciseType: goalPerformExerciseTypeResolvers,
};
