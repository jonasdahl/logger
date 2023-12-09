export const typeDefinitions = `union Activity = Exercise | FogisGame | PhysicalTest | PlannedExercise

interface ActivityBase {
  id: ID!
  start: DateTime!
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

scalar DateTime

type Day {
  activities(after: String, before: String, first: Int, includeHidden: Boolean, last: Int): ActivityConnection!
  date: String!
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

type Exercise implements ActivityBase {
  comment: String
  description: String
  id: ID!
  isHiddenFromOverview: Boolean!
  items: ExerciseItemConnection!
  primaryPurpose: ExercisePurpose
  secondaryPurpose: ExercisePurpose
  start: DateTime!
  title: String!
}

type ExerciseItem {
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

type ExercisePurpose {
  label: String!
  shortLabel: String
}

type ExerciseType {
  id: ID!
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

type FogisGame implements ActivityBase {
  awayTeam: String!
  homeTeam: String!
  id: ID!
  start: DateTime!
  title: String!
}

type HeartRateSummary {
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
  title: String!
}

type PlannedExercise implements ActivityBase {
  comment: String
  description: String
  id: ID!
  primaryPurpose: ExercisePurpose
  secondaryPurpose: ExercisePurpose
  start: DateTime!
  title: String!
}

type Query {
  activities(after: String, before: String, filter: ActivityFilter, first: Int, last: Int): ActivityConnection!
  activity(id: ID!): Activity
  day(date: String!): Day
  days(after: String, before: String, first: Int, last: Int): DayConnection!
  exercise(id: ID!): Exercise
  exerciseTypes: ExerciseTypeConnection!
  me: User
  today: Day!
}

type User {
  email: String!
  id: ID!
}`