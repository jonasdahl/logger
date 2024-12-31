export const typeDefinitions = `union Activity = CustomGame | Exercise | FogisGame | PhysicalTest | PlannedExercise | Travel

interface ActivityBase {
  id: ID!
  start: DateTime!
  startDay: Day!
  title: String!
}

type ActivityConnection {
  edges: [ActivityEdge!]!
  pageInfo: PageInfo!
}

type ActivityEdge {
  cursor: String!
  node: Activity
}

input ActivityFilter {
  startFrom: DateTime
  startTo: DateTime
}

interface ActivityGame {
  id: ID!
}

enum AmountType {
  Levels
  Repetitions
  Time
}

type CategoryTag {
  id: ID!
  name: String!
}

type CustomGame implements ActivityBase & ActivityGame {
  id: ID!
  start: DateTime!
  startDay: Day!
  title: String!
}

scalar DateTime

type Day {
  activities(after: String, before: String, first: Int, includeHidden: Boolean, last: Int): ActivityConnection!
  date: String!
  events: [Event!]!
  heartRateSummary: HeartRateSummary
  start: DateTime!
}

type DayConnection {
  edges: [DayEdge!]!
  pageInfo: PageInfo!
}

type DayEdge {
  cursor: String!
  node: Day
}

type Event {
  description: String!
  time: DateTime!
}

type Exercise implements ActivityBase {
  comment: String
  description: String
  fromPlannedActivity: PlannedExercise
  heartRateSummary: HeartRateSummary!
  id: ID!
  isHiddenFromOverview: Boolean!
  items: ExerciseItemConnection!
  primaryPurpose: ExercisePurpose
  secondaryPurpose: ExercisePurpose
  start: DateTime!
  startDay: Day!
  title: String!
}

type ExerciseAmount {
  duration: ExerciseDuration!
  loads: [ExerciseLoad!]!
}

union ExerciseDuration = ExerciseDurationLevel | ExerciseDurationRepetitions | ExerciseDurationTime

type ExerciseDurationLevel {
  levelType: ExerciseTypeLevel!
}

type ExerciseDurationRepetitions {
  repetitions: Int!
}

type ExerciseDurationTime {
  durationSeconds: Float!
}

type ExerciseItem {
  amount: [ExerciseAmount!]!
  exercise: Exercise!
  exerciseType: ExerciseType!
  id: ID!
}

type ExerciseItemConnection {
  edges: [ExerciseItemEdge!]!
  pageInfo: PageInfo!
}

type ExerciseItemEdge {
  cursor: String!
  node: ExerciseItem
}

type ExerciseLoad {
  type: ExerciseLoadType!
  unit: String
  value: Float!
}

type ExerciseLoadType {
  commonLoads: [ExerciseLoad!]!
  id: ID!
  name: String!
  unit: String
}

type ExercisePurpose {
  label: String!
  shortLabel: String
}

type ExerciseType {
  categoryTags: [CategoryTag!]!
  defaultAmountType: AmountType!
  history: ExerciseTypeHistory!
  id: ID!
  lastExerciseItem: ExerciseItem
  levels: [ExerciseTypeLevel!]!
  loadTypes: [ExerciseLoadType!]!
  name: String!
}

type ExerciseTypeConnection {
  edges: [ExerciseTypeEdge!]!
  pageInfo: PageInfo!
}

type ExerciseTypeEdge {
  cursor: String!
  node: ExerciseType
}

input ExerciseTypeFilter {
  search: String
}

type ExerciseTypeHistory {
  dayAmounts: [ExerciseTypeHistoryDayAmount!]!
  name: String!
}

type ExerciseTypeHistoryDayAmount {
  dayAmounts: [ExerciseAmount!]!
  dayStart: DateTime!
}

type ExerciseTypeLevel {
  id: ID!
  name: String!
  ordinal: Float!
}

type FogisGame implements ActivityBase & ActivityGame {
  awayTeam: String!
  homeTeam: String!
  id: ID!
  start: DateTime!
  startDay: Day!
  title: String!
}

union Goal = GoalDayOfRest | GoalDayOfWork | GoalGeneric | GoalPerformExerciseType

interface GoalBase {
  currentPeriodEnd: DateTime!
  currentPeriodStart: DateTime!
  currentProgress: Float
  id: ID!
  title: String!
}

type GoalDayOfRest implements GoalBase {
  currentDaysOfRest: Int!
  currentPeriodEnd: DateTime!
  currentPeriodStart: DateTime!
  currentProgress: Float!
  id: ID!
  targetDaysOfRest: Int!
  title: String!
}

type GoalDayOfWork implements GoalBase {
  currentDaysOfWork: Int!
  currentPeriodEnd: DateTime!
  currentPeriodStart: DateTime!
  currentProgress: Float!
  id: ID!
  targetDaysOfWork: Int!
  title: String!
}

type GoalGeneric implements GoalBase {
  currentPeriodEnd: DateTime!
  currentPeriodStart: DateTime!
  currentProgress: Float
  id: ID!
  title: String!
}

type GoalPerformExerciseType implements GoalBase {
  currentDayCount: Int!
  currentPeriodEnd: DateTime!
  currentPeriodStart: DateTime!
  currentProgress: Float!
  id: ID!
  targetDayCount: Int!
  title: String!
}

type HeartRateSample {
  heartRate: Float
  time: DateTime!
}

type HeartRateSummary {
  samples: [HeartRateSample!]!
  secondsInZone(heartRateZone: HeartRateZone): Int
}

enum HeartRateZone {
  Zone1
  Zone2
  Zone3
  Zone4
  Zone5
}

type PageInfo {
  endCursor: String
  hasNextPage: Boolean!
  hasPreviousPage: Boolean!
  startCursor: String
}

type PhysicalTest implements ActivityBase {
  id: ID!
  start: DateTime!
  startDay: Day!
  title: String!
}

type PlannedExercise implements ActivityBase {
  comment: String
  description: String
  exerciseItems: [PlannedExerciseItem!]!
  id: ID!
  primaryPurpose: ExercisePurpose
  secondaryPurpose: ExercisePurpose
  start: DateTime!
  startDay: Day!
  title: String!
}

type PlannedExerciseItem {
  exerciseType: ExerciseType
  id: ID!
  plannedExercise: PlannedExercise!
}

type Query {
  activities(after: String, before: String, filter: ActivityFilter, first: Int, last: Int): ActivityConnection!
  activity(id: ID!): Activity
  categoryTags: [CategoryTag!]!
  currentActivity: Activity
  day(date: String!): Day
  days(after: String, before: String, first: Int, last: Int): DayConnection!
  exercise(id: ID!): Exercise
  exerciseType(id: ID!): ExerciseType
  exerciseTypes(filter: ExerciseTypeFilter): ExerciseTypeConnection!
  game(id: ID!): ActivityGame
  goal(id: ID!): Goal
  goals: [Goal!]!
  lastActivity: Activity
  me: User
  plannedExercise(id: ID!): PlannedExercise
  timeZone: String!
  today: Day!
  upcomingPlannedExercise: PlannedExercise
}

type Travel implements ActivityBase {
  end: DateTime!
  id: ID!
  start: DateTime!
  startDay: Day!
  title: String!
}

type User {
  email: String!
  id: ID!
  maxPulse: Int
}`