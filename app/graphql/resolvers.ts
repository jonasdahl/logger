import type { Resolvers } from "./generated/graphql";
import { dateTimeScalar } from "./scalars/date-time/scalar";
import { activityBaseResolvers } from "./types/activity-base/resolvers";
import { activityConnectionResolvers } from "./types/activity-connection/resolvers";
import { activityEdgeResolvers } from "./types/activity-edge/resolvers";
import { activityResolvers } from "./types/activity/resolvers";
import { dayConnectionResolvers } from "./types/day-connection/resolvers";
import { dayEdgeResolvers } from "./types/day-edge/resolvers";
import { dayResolvers } from "./types/day/resolvers";
import { exercisePurposeResolvers } from "./types/exercise-purpose/resolvers";
import { exerciseResolvers } from "./types/exercise/resolvers";
import { fogisGameResolvers } from "./types/fogis-game/resolvers";
import { pageInfoResolvers } from "./types/page-info/resolvers";
import { plannedExerciseResolvers } from "./types/planned-exercise/resolvers";
import { queryResolvers } from "./types/query/resolvers";
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
};
