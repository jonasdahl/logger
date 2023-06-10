export const typeDefinitions = `union Activity = Exercise | FogisGame

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

type Query {
  activities(after: String, before: String, filter: ActivityFilter, first: Int, last: Int): ActivityConnection!
  me: User
}

type User {
  email: String!
  id: ID!
}`