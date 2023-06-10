export const typeDefinitions = `union Activity = Exercise | FogisGame | PlannedExercise

interface ActivityBase {
  id: ID!
  start: DateTime!
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
  start: DateTime!
}

type FogisGame implements ActivityBase {
  awayTeam: String!
  homeTeam: String!
  id: ID!
  start: DateTime!
}

type PageInfo {
  endCursor: String
  hasNextPage: Boolean!
  hasPreviousPage: Boolean!
  startCursor: String
}

type PlannedExercise implements ActivityBase {
  id: ID!
  start: DateTime!
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