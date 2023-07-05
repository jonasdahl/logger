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
  DateTime: { input: string; output: string; }
};

export type Activity = Exercise | FogisGame | PlannedExercise;

export type ActivityBase = {
  readonly id: Scalars['ID']['output'];
  readonly start: Scalars['DateTime']['output'];
  readonly title: Scalars['String']['output'];
};

export type ActivityConnection = {
  readonly __typename?: 'ActivityConnection';
  readonly edges: ReadonlyArray<ActivityEdge>;
  readonly pageInfo: PageInfo;
};

export type ActivityEdge = {
  readonly __typename?: 'ActivityEdge';
  readonly cursor: Scalars['String']['output'];
  readonly node: Maybe<Activity>;
};

export type ActivityFilter = {
  readonly startFrom: InputMaybe<Scalars['DateTime']['input']>;
  readonly startTo: InputMaybe<Scalars['DateTime']['input']>;
};

export type Day = {
  readonly __typename?: 'Day';
  readonly activities: ActivityConnection;
  readonly date: Scalars['String']['output'];
  readonly start: Scalars['DateTime']['output'];
};


export type DayActivitiesArgs = {
  after: InputMaybe<Scalars['String']['input']>;
  before: InputMaybe<Scalars['String']['input']>;
  first: InputMaybe<Scalars['Int']['input']>;
  includeHidden: InputMaybe<Scalars['Boolean']['input']>;
  last: InputMaybe<Scalars['Int']['input']>;
};

export type DayConnection = {
  readonly __typename?: 'DayConnection';
  readonly edges: ReadonlyArray<DayEdge>;
  readonly pageInfo: PageInfo;
};

export type DayEdge = {
  readonly __typename?: 'DayEdge';
  readonly cursor: Scalars['String']['output'];
  readonly node: Maybe<Day>;
};

export type Exercise = ActivityBase & {
  readonly __typename?: 'Exercise';
  readonly id: Scalars['ID']['output'];
  readonly isHiddenFromOverview: Scalars['Boolean']['output'];
  readonly primaryPurpose: Maybe<ExercisePurpose>;
  readonly secondaryPurpose: Maybe<ExercisePurpose>;
  readonly start: Scalars['DateTime']['output'];
  readonly title: Scalars['String']['output'];
};

export type ExercisePurpose = {
  readonly __typename?: 'ExercisePurpose';
  readonly label: Scalars['String']['output'];
  readonly shortLabel: Maybe<Scalars['String']['output']>;
};

export type FogisGame = ActivityBase & {
  readonly __typename?: 'FogisGame';
  readonly awayTeam: Scalars['String']['output'];
  readonly homeTeam: Scalars['String']['output'];
  readonly id: Scalars['ID']['output'];
  readonly start: Scalars['DateTime']['output'];
  readonly title: Scalars['String']['output'];
};

export type PageInfo = {
  readonly __typename?: 'PageInfo';
  readonly endCursor: Maybe<Scalars['String']['output']>;
  readonly hasNextPage: Scalars['Boolean']['output'];
  readonly hasPreviousPage: Scalars['Boolean']['output'];
  readonly startCursor: Maybe<Scalars['String']['output']>;
};

export type PlannedExercise = ActivityBase & {
  readonly __typename?: 'PlannedExercise';
  readonly id: Scalars['ID']['output'];
  readonly primaryPurpose: Maybe<ExercisePurpose>;
  readonly secondaryPurpose: Maybe<ExercisePurpose>;
  readonly start: Scalars['DateTime']['output'];
  readonly title: Scalars['String']['output'];
};

export type Query = {
  readonly __typename?: 'Query';
  readonly activities: ActivityConnection;
  readonly day: Maybe<Day>;
  readonly days: DayConnection;
  readonly me: Maybe<User>;
  readonly today: Day;
};


export type QueryActivitiesArgs = {
  after: InputMaybe<Scalars['String']['input']>;
  before: InputMaybe<Scalars['String']['input']>;
  filter: InputMaybe<ActivityFilter>;
  first: InputMaybe<Scalars['Int']['input']>;
  last: InputMaybe<Scalars['Int']['input']>;
};


export type QueryDayArgs = {
  date: Scalars['String']['input'];
};


export type QueryDaysArgs = {
  after: InputMaybe<Scalars['String']['input']>;
  before: InputMaybe<Scalars['String']['input']>;
  first: InputMaybe<Scalars['Int']['input']>;
  last: InputMaybe<Scalars['Int']['input']>;
};

export type User = {
  readonly __typename?: 'User';
  readonly email: Scalars['String']['output'];
  readonly id: Scalars['ID']['output'];
};

export type CalendarQueryVariables = Exact<{
  after: Scalars['String']['input'];
  before: Scalars['String']['input'];
}>;


export type CalendarQuery = { readonly __typename?: 'Query', readonly days: { readonly __typename?: 'DayConnection', readonly edges: ReadonlyArray<{ readonly __typename?: 'DayEdge', readonly cursor: string, readonly node: { readonly __typename?: 'Day', readonly start: string, readonly date: string, readonly activities: { readonly __typename?: 'ActivityConnection', readonly edges: ReadonlyArray<{ readonly __typename?: 'ActivityEdge', readonly cursor: string, readonly node: { readonly __typename: 'Exercise', readonly start: string, readonly title: string, readonly isHiddenFromOverview: boolean, readonly primaryPurpose: { readonly __typename?: 'ExercisePurpose', readonly label: string, readonly shortLabel: string | null } | null, readonly secondaryPurpose: { readonly __typename?: 'ExercisePurpose', readonly label: string, readonly shortLabel: string | null } | null } | { readonly __typename: 'FogisGame', readonly start: string, readonly title: string, readonly homeTeam: string, readonly awayTeam: string } | { readonly __typename: 'PlannedExercise', readonly start: string, readonly title: string, readonly primaryPurpose: { readonly __typename?: 'ExercisePurpose', readonly label: string, readonly shortLabel: string | null } | null, readonly secondaryPurpose: { readonly __typename?: 'ExercisePurpose', readonly label: string, readonly shortLabel: string | null } | null } | null }> } } | null }> } };

export type CalendarDayFragment = { readonly __typename?: 'Day', readonly start: string, readonly date: string, readonly activities: { readonly __typename?: 'ActivityConnection', readonly edges: ReadonlyArray<{ readonly __typename?: 'ActivityEdge', readonly cursor: string, readonly node: { readonly __typename: 'Exercise', readonly start: string, readonly title: string, readonly isHiddenFromOverview: boolean, readonly primaryPurpose: { readonly __typename?: 'ExercisePurpose', readonly label: string, readonly shortLabel: string | null } | null, readonly secondaryPurpose: { readonly __typename?: 'ExercisePurpose', readonly label: string, readonly shortLabel: string | null } | null } | { readonly __typename: 'FogisGame', readonly start: string, readonly title: string, readonly homeTeam: string, readonly awayTeam: string } | { readonly __typename: 'PlannedExercise', readonly start: string, readonly title: string, readonly primaryPurpose: { readonly __typename?: 'ExercisePurpose', readonly label: string, readonly shortLabel: string | null } | null, readonly secondaryPurpose: { readonly __typename?: 'ExercisePurpose', readonly label: string, readonly shortLabel: string | null } | null } | null }> } };

type CalendarActivity_Exercise_Fragment = { readonly __typename: 'Exercise', readonly start: string, readonly title: string, readonly isHiddenFromOverview: boolean, readonly primaryPurpose: { readonly __typename?: 'ExercisePurpose', readonly label: string, readonly shortLabel: string | null } | null, readonly secondaryPurpose: { readonly __typename?: 'ExercisePurpose', readonly label: string, readonly shortLabel: string | null } | null };

type CalendarActivity_FogisGame_Fragment = { readonly __typename: 'FogisGame', readonly start: string, readonly title: string, readonly homeTeam: string, readonly awayTeam: string };

type CalendarActivity_PlannedExercise_Fragment = { readonly __typename: 'PlannedExercise', readonly start: string, readonly title: string, readonly primaryPurpose: { readonly __typename?: 'ExercisePurpose', readonly label: string, readonly shortLabel: string | null } | null, readonly secondaryPurpose: { readonly __typename?: 'ExercisePurpose', readonly label: string, readonly shortLabel: string | null } | null };

export type CalendarActivityFragment = CalendarActivity_Exercise_Fragment | CalendarActivity_FogisGame_Fragment | CalendarActivity_PlannedExercise_Fragment;

export type DashboardQueryVariables = Exact<{ [key: string]: never; }>;


export type DashboardQuery = { readonly __typename?: 'Query', readonly me: { readonly __typename?: 'User', readonly email: string } | null };

export const CalendarActivityFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CalendarActivity"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Activity"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ActivityBase"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"start"}},{"kind":"Field","name":{"kind":"Name","value":"title"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"FogisGame"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"homeTeam"}},{"kind":"Field","name":{"kind":"Name","value":"awayTeam"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Exercise"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"isHiddenFromOverview"}},{"kind":"Field","name":{"kind":"Name","value":"primaryPurpose"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"label"}},{"kind":"Field","name":{"kind":"Name","value":"shortLabel"}}]}},{"kind":"Field","name":{"kind":"Name","value":"secondaryPurpose"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"label"}},{"kind":"Field","name":{"kind":"Name","value":"shortLabel"}}]}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"PlannedExercise"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"primaryPurpose"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"label"}},{"kind":"Field","name":{"kind":"Name","value":"shortLabel"}}]}},{"kind":"Field","name":{"kind":"Name","value":"secondaryPurpose"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"label"}},{"kind":"Field","name":{"kind":"Name","value":"shortLabel"}}]}}]}}]}}]} as unknown as DocumentNode<CalendarActivityFragment, unknown>;
export const CalendarDayFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CalendarDay"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Day"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"start"}},{"kind":"Field","name":{"kind":"Name","value":"date"}},{"kind":"Field","name":{"kind":"Name","value":"activities"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"edges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cursor"}},{"kind":"Field","name":{"kind":"Name","value":"node"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"CalendarActivity"}}]}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CalendarActivity"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Activity"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ActivityBase"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"start"}},{"kind":"Field","name":{"kind":"Name","value":"title"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"FogisGame"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"homeTeam"}},{"kind":"Field","name":{"kind":"Name","value":"awayTeam"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Exercise"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"isHiddenFromOverview"}},{"kind":"Field","name":{"kind":"Name","value":"primaryPurpose"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"label"}},{"kind":"Field","name":{"kind":"Name","value":"shortLabel"}}]}},{"kind":"Field","name":{"kind":"Name","value":"secondaryPurpose"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"label"}},{"kind":"Field","name":{"kind":"Name","value":"shortLabel"}}]}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"PlannedExercise"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"primaryPurpose"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"label"}},{"kind":"Field","name":{"kind":"Name","value":"shortLabel"}}]}},{"kind":"Field","name":{"kind":"Name","value":"secondaryPurpose"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"label"}},{"kind":"Field","name":{"kind":"Name","value":"shortLabel"}}]}}]}}]}}]} as unknown as DocumentNode<CalendarDayFragment, unknown>;
export const CalendarDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Calendar"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"after"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"before"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"days"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"after"},"value":{"kind":"Variable","name":{"kind":"Name","value":"after"}}},{"kind":"Argument","name":{"kind":"Name","value":"before"},"value":{"kind":"Variable","name":{"kind":"Name","value":"before"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"edges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cursor"}},{"kind":"Field","name":{"kind":"Name","value":"node"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"CalendarDay"}}]}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CalendarActivity"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Activity"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ActivityBase"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"start"}},{"kind":"Field","name":{"kind":"Name","value":"title"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"FogisGame"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"homeTeam"}},{"kind":"Field","name":{"kind":"Name","value":"awayTeam"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Exercise"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"isHiddenFromOverview"}},{"kind":"Field","name":{"kind":"Name","value":"primaryPurpose"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"label"}},{"kind":"Field","name":{"kind":"Name","value":"shortLabel"}}]}},{"kind":"Field","name":{"kind":"Name","value":"secondaryPurpose"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"label"}},{"kind":"Field","name":{"kind":"Name","value":"shortLabel"}}]}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"PlannedExercise"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"primaryPurpose"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"label"}},{"kind":"Field","name":{"kind":"Name","value":"shortLabel"}}]}},{"kind":"Field","name":{"kind":"Name","value":"secondaryPurpose"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"label"}},{"kind":"Field","name":{"kind":"Name","value":"shortLabel"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CalendarDay"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Day"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"start"}},{"kind":"Field","name":{"kind":"Name","value":"date"}},{"kind":"Field","name":{"kind":"Name","value":"activities"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"edges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cursor"}},{"kind":"Field","name":{"kind":"Name","value":"node"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"CalendarActivity"}}]}}]}}]}}]}}]} as unknown as DocumentNode<CalendarQuery, CalendarQueryVariables>;
export const DashboardDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Dashboard"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"me"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"email"}}]}}]}}]} as unknown as DocumentNode<DashboardQuery, DashboardQueryVariables>;