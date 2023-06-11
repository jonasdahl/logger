export const typeDefinitions = `union Activity = Exercise | FogisGame | PlannedExercise

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
  activities(after: String, before: String, first: Int, last: Int): ActivityConnection!
  date: String!
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
  id: ID!
  primaryPurpose: ExercisePurpose
  secondaryPurpose: ExercisePurpose
  start: DateTime!
  title: String!
}

type ExercisePurpose {
  label: String!
  shortLabel: String
}

type FogisGame implements ActivityBase {
  awayTeam: String!
  homeTeam: String!
  id: ID!
  start: DateTime!
  title: String!
}

type PageInfo {
  endCursor: String
  hasNextPage: Boolean!
  hasPreviousPage: Boolean!
  startCursor: String
}

type PlannedExercise implements ActivityBase {
  id: ID!
  primaryPurpose: ExercisePurpose
  secondaryPurpose: ExercisePurpose
  start: DateTime!
  title: String!
}

type Query {
  activities(after: String, before: String, filter: ActivityFilter, first: Int, last: Int): ActivityConnection!
  day(date: String!): Day
  days(after: String, before: String, first: Int, last: Int): DayConnection!
  me: User
  today: Day!
}

type User {
  email: String!
  id: ID!
}`