import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string | number; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  DateTime: { input: any; output: any; }
};

export type Activity = Exercise | FogisGame;

export type ActivityBase = {
  id: Scalars['ID']['output'];
  start: Scalars['DateTime']['output'];
};

export type ActivityConnection = {
  __typename?: 'ActivityConnection';
  edges: Array<ActivityEdge>;
  pageInfo: PageInfo;
};

export type ActivityEdge = {
  __typename?: 'ActivityEdge';
  cursor: Scalars['String']['output'];
  node?: Maybe<Activity>;
};

export type ActivityFilter = {
  startFrom?: InputMaybe<Scalars['DateTime']['input']>;
  startTo?: InputMaybe<Scalars['DateTime']['input']>;
};

export type Day = {
  __typename?: 'Day';
  activities: ActivityConnection;
  start?: Maybe<Scalars['DateTime']['output']>;
};


export type DayActivitiesArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
};

export type Exercise = ActivityBase & {
  __typename?: 'Exercise';
  id: Scalars['ID']['output'];
  start: Scalars['DateTime']['output'];
};

export type FogisGame = ActivityBase & {
  __typename?: 'FogisGame';
  awayTeam: Scalars['String']['output'];
  homeTeam: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  start: Scalars['DateTime']['output'];
};

export type PageInfo = {
  __typename?: 'PageInfo';
  endCursor?: Maybe<Scalars['String']['output']>;
  hasNextPage: Scalars['Boolean']['output'];
  hasPreviousPage: Scalars['Boolean']['output'];
  startCursor?: Maybe<Scalars['String']['output']>;
};

export type Query = {
  __typename?: 'Query';
  activities: ActivityConnection;
  day?: Maybe<Day>;
  me?: Maybe<User>;
};


export type QueryActivitiesArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  filter?: InputMaybe<ActivityFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryDayArgs = {
  date: Scalars['String']['input'];
};

export type User = {
  __typename?: 'User';
  email: Scalars['String']['output'];
  id: Scalars['ID']['output'];
};

export type DashboardQueryVariables = Exact<{ [key: string]: never; }>;


export type DashboardQuery = { __typename?: 'Query', me?: { __typename?: 'User', email: string } | null };


export const DashboardDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Dashboard"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"me"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"email"}}]}}]}}]} as unknown as DocumentNode<DashboardQuery, DashboardQueryVariables>;