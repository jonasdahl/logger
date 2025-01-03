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
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  DateTime: { input: string; output: string; }
};

export type Activity = CustomGame | Exercise | FogisGame | PhysicalTest | PlannedExercise | Travel;

export type ActivityBase = {
  readonly id: Scalars['ID']['output'];
  readonly start: Scalars['DateTime']['output'];
  readonly startDay: Day;
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

export type ActivityGame = {
  readonly id: Scalars['ID']['output'];
};

export enum AmountType {
  Levels = 'Levels',
  Repetitions = 'Repetitions',
  Time = 'Time'
}

export type CategoryTag = {
  readonly __typename?: 'CategoryTag';
  readonly id: Scalars['ID']['output'];
  readonly name: Scalars['String']['output'];
};

export type CustomGame = ActivityBase & ActivityGame & {
  readonly __typename?: 'CustomGame';
  readonly id: Scalars['ID']['output'];
  readonly start: Scalars['DateTime']['output'];
  readonly startDay: Day;
  readonly title: Scalars['String']['output'];
};

export type Day = {
  readonly __typename?: 'Day';
  readonly activities: ActivityConnection;
  readonly date: Scalars['String']['output'];
  readonly events: ReadonlyArray<Event>;
  readonly heartRateSummary: Maybe<HeartRateSummary>;
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

export type Event = {
  readonly __typename?: 'Event';
  readonly description: Scalars['String']['output'];
  readonly time: Scalars['DateTime']['output'];
};

export type Exercise = ActivityBase & {
  readonly __typename?: 'Exercise';
  readonly comment: Maybe<Scalars['String']['output']>;
  readonly description: Maybe<Scalars['String']['output']>;
  readonly fromPlannedActivity: Maybe<PlannedExercise>;
  readonly heartRateSummary: HeartRateSummary;
  readonly id: Scalars['ID']['output'];
  readonly isHiddenFromOverview: Scalars['Boolean']['output'];
  readonly items: ExerciseItemConnection;
  readonly primaryPurpose: Maybe<ExercisePurpose>;
  readonly secondaryPurpose: Maybe<ExercisePurpose>;
  readonly start: Scalars['DateTime']['output'];
  readonly startDay: Day;
  readonly title: Scalars['String']['output'];
};

export type ExerciseAmount = {
  readonly __typename?: 'ExerciseAmount';
  readonly duration: ExerciseDuration;
  readonly loads: ReadonlyArray<ExerciseLoad>;
};

export type ExerciseDuration = ExerciseDurationLevel | ExerciseDurationRepetitions | ExerciseDurationTime;

export type ExerciseDurationLevel = {
  readonly __typename?: 'ExerciseDurationLevel';
  readonly levelType: ExerciseTypeLevel;
};

export type ExerciseDurationRepetitions = {
  readonly __typename?: 'ExerciseDurationRepetitions';
  readonly repetitions: Scalars['Int']['output'];
};

export type ExerciseDurationTime = {
  readonly __typename?: 'ExerciseDurationTime';
  readonly durationSeconds: Scalars['Float']['output'];
};

export type ExerciseItem = {
  readonly __typename?: 'ExerciseItem';
  readonly amount: ReadonlyArray<ExerciseAmount>;
  readonly exercise: Exercise;
  readonly exerciseType: ExerciseType;
  readonly id: Scalars['ID']['output'];
};

export type ExerciseItemConnection = {
  readonly __typename?: 'ExerciseItemConnection';
  readonly edges: ReadonlyArray<ExerciseItemEdge>;
  readonly pageInfo: PageInfo;
};

export type ExerciseItemEdge = {
  readonly __typename?: 'ExerciseItemEdge';
  readonly cursor: Scalars['String']['output'];
  readonly node: Maybe<ExerciseItem>;
};

export type ExerciseLoad = {
  readonly __typename?: 'ExerciseLoad';
  readonly type: ExerciseLoadType;
  readonly unit: Maybe<Scalars['String']['output']>;
  readonly value: Scalars['Float']['output'];
};

export type ExerciseLoadType = {
  readonly __typename?: 'ExerciseLoadType';
  readonly commonLoads: ReadonlyArray<ExerciseLoad>;
  readonly id: Scalars['ID']['output'];
  readonly name: Scalars['String']['output'];
  readonly unit: Maybe<Scalars['String']['output']>;
};

export type ExercisePurpose = {
  readonly __typename?: 'ExercisePurpose';
  readonly label: Scalars['String']['output'];
  readonly shortLabel: Maybe<Scalars['String']['output']>;
};

export type ExerciseType = {
  readonly __typename?: 'ExerciseType';
  readonly categoryTags: ReadonlyArray<CategoryTag>;
  readonly defaultAmountType: AmountType;
  readonly history: ExerciseTypeHistory;
  readonly id: Scalars['ID']['output'];
  readonly lastExerciseItem: Maybe<ExerciseItem>;
  readonly levels: ReadonlyArray<ExerciseTypeLevel>;
  readonly loadTypes: ReadonlyArray<ExerciseLoadType>;
  readonly name: Scalars['String']['output'];
};

export type ExerciseTypeConnection = {
  readonly __typename?: 'ExerciseTypeConnection';
  readonly edges: ReadonlyArray<ExerciseTypeEdge>;
  readonly pageInfo: PageInfo;
};

export type ExerciseTypeEdge = {
  readonly __typename?: 'ExerciseTypeEdge';
  readonly cursor: Scalars['String']['output'];
  readonly node: Maybe<ExerciseType>;
};

export type ExerciseTypeFilter = {
  readonly search: InputMaybe<Scalars['String']['input']>;
};

export type ExerciseTypeHistory = {
  readonly __typename?: 'ExerciseTypeHistory';
  readonly dayAmounts: ReadonlyArray<ExerciseTypeHistoryDayAmount>;
  readonly name: Scalars['String']['output'];
};

export type ExerciseTypeHistoryDayAmount = {
  readonly __typename?: 'ExerciseTypeHistoryDayAmount';
  readonly dayAmounts: ReadonlyArray<ExerciseAmount>;
  readonly dayStart: Scalars['DateTime']['output'];
};

export type ExerciseTypeLevel = {
  readonly __typename?: 'ExerciseTypeLevel';
  readonly id: Scalars['ID']['output'];
  readonly name: Scalars['String']['output'];
  readonly ordinal: Scalars['Float']['output'];
};

export type FogisGame = ActivityBase & ActivityGame & {
  readonly __typename?: 'FogisGame';
  readonly awayTeam: Scalars['String']['output'];
  readonly homeTeam: Scalars['String']['output'];
  readonly id: Scalars['ID']['output'];
  readonly start: Scalars['DateTime']['output'];
  readonly startDay: Day;
  readonly title: Scalars['String']['output'];
};

export type Goal = GoalDayOfRest | GoalDayOfWork | GoalGeneric | GoalPerformExerciseType;

export type GoalBase = {
  readonly currentPeriodEnd: Scalars['DateTime']['output'];
  readonly currentPeriodStart: Scalars['DateTime']['output'];
  readonly currentProgress: Maybe<Scalars['Float']['output']>;
  readonly id: Scalars['ID']['output'];
  readonly title: Scalars['String']['output'];
};

export type GoalDayOfRest = GoalBase & {
  readonly __typename?: 'GoalDayOfRest';
  readonly currentDaysOfRest: Scalars['Int']['output'];
  readonly currentPeriodEnd: Scalars['DateTime']['output'];
  readonly currentPeriodStart: Scalars['DateTime']['output'];
  readonly currentProgress: Scalars['Float']['output'];
  readonly id: Scalars['ID']['output'];
  readonly targetDaysOfRest: Scalars['Int']['output'];
  readonly title: Scalars['String']['output'];
};

export type GoalDayOfWork = GoalBase & {
  readonly __typename?: 'GoalDayOfWork';
  readonly currentDaysOfWork: Scalars['Int']['output'];
  readonly currentPeriodEnd: Scalars['DateTime']['output'];
  readonly currentPeriodStart: Scalars['DateTime']['output'];
  readonly currentProgress: Scalars['Float']['output'];
  readonly id: Scalars['ID']['output'];
  readonly targetDaysOfWork: Scalars['Int']['output'];
  readonly title: Scalars['String']['output'];
};

export type GoalGeneric = GoalBase & {
  readonly __typename?: 'GoalGeneric';
  readonly currentPeriodEnd: Scalars['DateTime']['output'];
  readonly currentPeriodStart: Scalars['DateTime']['output'];
  readonly currentProgress: Maybe<Scalars['Float']['output']>;
  readonly id: Scalars['ID']['output'];
  readonly title: Scalars['String']['output'];
};

export type GoalPerformExerciseType = GoalBase & {
  readonly __typename?: 'GoalPerformExerciseType';
  readonly currentDayCount: Scalars['Int']['output'];
  readonly currentPeriodEnd: Scalars['DateTime']['output'];
  readonly currentPeriodStart: Scalars['DateTime']['output'];
  readonly currentProgress: Scalars['Float']['output'];
  readonly id: Scalars['ID']['output'];
  readonly targetDayCount: Scalars['Int']['output'];
  readonly title: Scalars['String']['output'];
};

export type HeartRateSample = {
  readonly __typename?: 'HeartRateSample';
  readonly heartRate: Maybe<Scalars['Float']['output']>;
  readonly time: Scalars['DateTime']['output'];
};

export type HeartRateSummary = {
  readonly __typename?: 'HeartRateSummary';
  readonly samples: ReadonlyArray<HeartRateSample>;
  readonly secondsInZone: Maybe<Scalars['Int']['output']>;
};


export type HeartRateSummarySecondsInZoneArgs = {
  heartRateZone: InputMaybe<HeartRateZone>;
};

export enum HeartRateZone {
  Zone1 = 'Zone1',
  Zone2 = 'Zone2',
  Zone3 = 'Zone3',
  Zone4 = 'Zone4',
  Zone5 = 'Zone5'
}

export type PageInfo = {
  readonly __typename?: 'PageInfo';
  readonly endCursor: Maybe<Scalars['String']['output']>;
  readonly hasNextPage: Scalars['Boolean']['output'];
  readonly hasPreviousPage: Scalars['Boolean']['output'];
  readonly startCursor: Maybe<Scalars['String']['output']>;
};

export type PhysicalTest = ActivityBase & {
  readonly __typename?: 'PhysicalTest';
  readonly id: Scalars['ID']['output'];
  readonly start: Scalars['DateTime']['output'];
  readonly startDay: Day;
  readonly title: Scalars['String']['output'];
};

export type PlannedExercise = ActivityBase & {
  readonly __typename?: 'PlannedExercise';
  readonly comment: Maybe<Scalars['String']['output']>;
  readonly description: Maybe<Scalars['String']['output']>;
  readonly exerciseItems: ReadonlyArray<PlannedExerciseItem>;
  readonly id: Scalars['ID']['output'];
  readonly primaryPurpose: Maybe<ExercisePurpose>;
  readonly secondaryPurpose: Maybe<ExercisePurpose>;
  readonly start: Scalars['DateTime']['output'];
  readonly startDay: Day;
  readonly title: Scalars['String']['output'];
};

export type PlannedExerciseItem = {
  readonly __typename?: 'PlannedExerciseItem';
  readonly exerciseType: Maybe<ExerciseType>;
  readonly id: Scalars['ID']['output'];
  readonly plannedExercise: PlannedExercise;
};

export type Query = {
  readonly __typename?: 'Query';
  readonly activities: ActivityConnection;
  readonly activity: Maybe<Activity>;
  readonly categoryTags: ReadonlyArray<CategoryTag>;
  readonly currentActivity: Maybe<Activity>;
  readonly day: Maybe<Day>;
  readonly days: DayConnection;
  readonly exercise: Maybe<Exercise>;
  readonly exerciseType: Maybe<ExerciseType>;
  readonly exerciseTypes: ExerciseTypeConnection;
  readonly game: Maybe<ActivityGame>;
  readonly goal: Maybe<Goal>;
  readonly goals: ReadonlyArray<Goal>;
  readonly lastActivity: Maybe<Activity>;
  readonly me: Maybe<User>;
  readonly plannedExercise: Maybe<PlannedExercise>;
  readonly timeZone: Scalars['String']['output'];
  readonly today: Day;
  readonly upcomingPlannedExercise: Maybe<PlannedExercise>;
};


export type QueryActivitiesArgs = {
  after: InputMaybe<Scalars['String']['input']>;
  before: InputMaybe<Scalars['String']['input']>;
  filter: InputMaybe<ActivityFilter>;
  first: InputMaybe<Scalars['Int']['input']>;
  last: InputMaybe<Scalars['Int']['input']>;
};


export type QueryActivityArgs = {
  id: Scalars['ID']['input'];
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


export type QueryExerciseArgs = {
  id: Scalars['ID']['input'];
};


export type QueryExerciseTypeArgs = {
  id: Scalars['ID']['input'];
};


export type QueryExerciseTypesArgs = {
  filter: InputMaybe<ExerciseTypeFilter>;
};


export type QueryGameArgs = {
  id: Scalars['ID']['input'];
};


export type QueryGoalArgs = {
  id: Scalars['ID']['input'];
};


export type QueryPlannedExerciseArgs = {
  id: Scalars['ID']['input'];
};

export type Travel = ActivityBase & {
  readonly __typename?: 'Travel';
  readonly end: Scalars['DateTime']['output'];
  readonly id: Scalars['ID']['output'];
  readonly start: Scalars['DateTime']['output'];
  readonly startDay: Day;
  readonly title: Scalars['String']['output'];
};

export type User = {
  readonly __typename?: 'User';
  readonly email: Scalars['String']['output'];
  readonly id: Scalars['ID']['output'];
  readonly maxPulse: Maybe<Scalars['Int']['output']>;
};

export type DashboardOverviewQueryVariables = Exact<{ [key: string]: never; }>;


export type DashboardOverviewQuery = { readonly __typename?: 'Query', readonly timeZone: string, readonly goals: ReadonlyArray<{ readonly __typename: 'GoalDayOfRest', readonly id: string, readonly title: string, readonly currentProgress: number, readonly currentDaysOfRest: number, readonly targetDaysOfRest: number } | { readonly __typename: 'GoalDayOfWork', readonly id: string, readonly title: string, readonly currentProgress: number, readonly currentDaysOfWork: number, readonly targetDaysOfWork: number } | { readonly __typename: 'GoalGeneric', readonly id: string, readonly title: string, readonly currentProgress: number | null } | { readonly __typename: 'GoalPerformExerciseType', readonly id: string, readonly title: string, readonly currentProgress: number, readonly currentDayCount: number, readonly targetDayCount: number }>, readonly upcomingPlannedExercise: { readonly __typename?: 'PlannedExercise', readonly id: string, readonly start: string, readonly primaryPurpose: { readonly __typename?: 'ExercisePurpose', readonly label: string } | null, readonly secondaryPurpose: { readonly __typename?: 'ExercisePurpose', readonly label: string } | null } | null, readonly lastActivity: { readonly __typename: 'CustomGame', readonly id: string, readonly title: string, readonly start: string } | { readonly __typename: 'Exercise', readonly id: string, readonly title: string, readonly start: string, readonly primaryPurpose: { readonly __typename?: 'ExercisePurpose', readonly label: string } | null, readonly secondaryPurpose: { readonly __typename?: 'ExercisePurpose', readonly label: string } | null } | { readonly __typename: 'FogisGame', readonly id: string, readonly title: string, readonly start: string } | { readonly __typename: 'PhysicalTest', readonly id: string, readonly title: string, readonly start: string } | { readonly __typename: 'PlannedExercise', readonly id: string, readonly title: string, readonly start: string } | { readonly __typename: 'Travel', readonly id: string, readonly title: string, readonly start: string } | null, readonly currentActivity: { readonly __typename: 'CustomGame', readonly id: string, readonly title: string, readonly start: string } | { readonly __typename: 'Exercise', readonly id: string, readonly title: string, readonly start: string, readonly primaryPurpose: { readonly __typename?: 'ExercisePurpose', readonly label: string } | null, readonly secondaryPurpose: { readonly __typename?: 'ExercisePurpose', readonly label: string } | null } | { readonly __typename: 'FogisGame', readonly id: string, readonly title: string, readonly start: string } | { readonly __typename: 'PhysicalTest', readonly id: string, readonly title: string, readonly start: string } | { readonly __typename: 'PlannedExercise', readonly id: string, readonly title: string, readonly start: string } | { readonly __typename: 'Travel', readonly id: string, readonly title: string, readonly start: string } | null };

export type ActionsQueryVariables = Exact<{ [key: string]: never; }>;


export type ActionsQuery = { readonly __typename?: 'Query', readonly currentActivity: { readonly __typename: 'CustomGame' } | { readonly __typename: 'Exercise', readonly id: string } | { readonly __typename: 'FogisGame' } | { readonly __typename: 'PhysicalTest' } | { readonly __typename: 'PlannedExercise' } | { readonly __typename: 'Travel' } | null, readonly today: { readonly __typename?: 'Day', readonly activities: { readonly __typename?: 'ActivityConnection', readonly edges: ReadonlyArray<{ readonly __typename?: 'ActivityEdge', readonly node: { readonly __typename: 'CustomGame', readonly id: string, readonly title: string } | { readonly __typename: 'Exercise', readonly id: string, readonly title: string } | { readonly __typename: 'FogisGame', readonly id: string, readonly title: string } | { readonly __typename: 'PhysicalTest', readonly id: string, readonly title: string } | { readonly __typename: 'PlannedExercise', readonly id: string, readonly title: string } | { readonly __typename: 'Travel', readonly id: string, readonly title: string } | null }> } } };

export type CalendarQueryVariables = Exact<{
  after: Scalars['String']['input'];
  before: Scalars['String']['input'];
}>;


export type CalendarQuery = { readonly __typename?: 'Query', readonly days: { readonly __typename?: 'DayConnection', readonly edges: ReadonlyArray<{ readonly __typename?: 'DayEdge', readonly cursor: string, readonly node: { readonly __typename?: 'Day', readonly start: string, readonly date: string, readonly heartRateSummary: { readonly __typename?: 'HeartRateSummary', readonly secondsInZone4: number | null, readonly secondsInZone5: number | null } | null, readonly activities: { readonly __typename?: 'ActivityConnection', readonly edges: ReadonlyArray<{ readonly __typename?: 'ActivityEdge', readonly cursor: string, readonly node: { readonly __typename: 'CustomGame', readonly id: string, readonly start: string, readonly title: string } | { readonly __typename: 'Exercise', readonly id: string, readonly start: string, readonly title: string, readonly isHiddenFromOverview: boolean, readonly comment: string | null, readonly description: string | null, readonly primaryPurpose: { readonly __typename?: 'ExercisePurpose', readonly label: string, readonly shortLabel: string | null } | null, readonly secondaryPurpose: { readonly __typename?: 'ExercisePurpose', readonly label: string, readonly shortLabel: string | null } | null } | { readonly __typename: 'FogisGame', readonly id: string, readonly start: string, readonly title: string, readonly homeTeam: string, readonly awayTeam: string } | { readonly __typename: 'PhysicalTest', readonly id: string, readonly start: string, readonly title: string } | { readonly __typename: 'PlannedExercise', readonly id: string, readonly start: string, readonly title: string, readonly primaryPurpose: { readonly __typename?: 'ExercisePurpose', readonly label: string, readonly shortLabel: string | null } | null, readonly secondaryPurpose: { readonly __typename?: 'ExercisePurpose', readonly label: string, readonly shortLabel: string | null } | null } | { readonly __typename: 'Travel', readonly id: string, readonly start: string, readonly title: string } | null }> } } | null }> } };

export type CalendarDayFragment = { readonly __typename?: 'Day', readonly start: string, readonly date: string, readonly heartRateSummary: { readonly __typename?: 'HeartRateSummary', readonly secondsInZone4: number | null, readonly secondsInZone5: number | null } | null, readonly activities: { readonly __typename?: 'ActivityConnection', readonly edges: ReadonlyArray<{ readonly __typename?: 'ActivityEdge', readonly cursor: string, readonly node: { readonly __typename: 'CustomGame', readonly id: string, readonly start: string, readonly title: string } | { readonly __typename: 'Exercise', readonly id: string, readonly start: string, readonly title: string, readonly isHiddenFromOverview: boolean, readonly comment: string | null, readonly description: string | null, readonly primaryPurpose: { readonly __typename?: 'ExercisePurpose', readonly label: string, readonly shortLabel: string | null } | null, readonly secondaryPurpose: { readonly __typename?: 'ExercisePurpose', readonly label: string, readonly shortLabel: string | null } | null } | { readonly __typename: 'FogisGame', readonly id: string, readonly start: string, readonly title: string, readonly homeTeam: string, readonly awayTeam: string } | { readonly __typename: 'PhysicalTest', readonly id: string, readonly start: string, readonly title: string } | { readonly __typename: 'PlannedExercise', readonly id: string, readonly start: string, readonly title: string, readonly primaryPurpose: { readonly __typename?: 'ExercisePurpose', readonly label: string, readonly shortLabel: string | null } | null, readonly secondaryPurpose: { readonly __typename?: 'ExercisePurpose', readonly label: string, readonly shortLabel: string | null } | null } | { readonly __typename: 'Travel', readonly id: string, readonly start: string, readonly title: string } | null }> } };

type CalendarActivity_CustomGame_Fragment = { readonly __typename: 'CustomGame', readonly id: string, readonly start: string, readonly title: string };

type CalendarActivity_Exercise_Fragment = { readonly __typename: 'Exercise', readonly id: string, readonly start: string, readonly title: string, readonly isHiddenFromOverview: boolean, readonly comment: string | null, readonly description: string | null, readonly primaryPurpose: { readonly __typename?: 'ExercisePurpose', readonly label: string, readonly shortLabel: string | null } | null, readonly secondaryPurpose: { readonly __typename?: 'ExercisePurpose', readonly label: string, readonly shortLabel: string | null } | null };

type CalendarActivity_FogisGame_Fragment = { readonly __typename: 'FogisGame', readonly id: string, readonly start: string, readonly title: string, readonly homeTeam: string, readonly awayTeam: string };

type CalendarActivity_PhysicalTest_Fragment = { readonly __typename: 'PhysicalTest', readonly id: string, readonly start: string, readonly title: string };

type CalendarActivity_PlannedExercise_Fragment = { readonly __typename: 'PlannedExercise', readonly id: string, readonly start: string, readonly title: string, readonly primaryPurpose: { readonly __typename?: 'ExercisePurpose', readonly label: string, readonly shortLabel: string | null } | null, readonly secondaryPurpose: { readonly __typename?: 'ExercisePurpose', readonly label: string, readonly shortLabel: string | null } | null };

type CalendarActivity_Travel_Fragment = { readonly __typename: 'Travel', readonly id: string, readonly start: string, readonly title: string };

export type CalendarActivityFragment = CalendarActivity_CustomGame_Fragment | CalendarActivity_Exercise_Fragment | CalendarActivity_FogisGame_Fragment | CalendarActivity_PhysicalTest_Fragment | CalendarActivity_PlannedExercise_Fragment | CalendarActivity_Travel_Fragment;

export type ShowDayQueryVariables = Exact<{
  date: Scalars['String']['input'];
}>;


export type ShowDayQuery = { readonly __typename?: 'Query', readonly day: { readonly __typename?: 'Day', readonly activities: { readonly __typename?: 'ActivityConnection', readonly edges: ReadonlyArray<{ readonly __typename?: 'ActivityEdge', readonly node: { readonly __typename: 'CustomGame', readonly id: string, readonly start: string, readonly title: string } | { readonly __typename: 'Exercise', readonly id: string, readonly start: string, readonly title: string, readonly description: string | null, readonly comment: string | null, readonly isHiddenFromOverview: boolean, readonly primaryPurpose: { readonly __typename?: 'ExercisePurpose', readonly label: string } | null, readonly secondaryPurpose: { readonly __typename?: 'ExercisePurpose', readonly label: string } | null } | { readonly __typename: 'FogisGame', readonly id: string, readonly start: string, readonly title: string, readonly homeTeam: string, readonly awayTeam: string } | { readonly __typename: 'PhysicalTest', readonly id: string, readonly start: string, readonly title: string } | { readonly __typename: 'PlannedExercise', readonly id: string, readonly start: string, readonly title: string, readonly description: string | null, readonly comment: string | null, readonly primaryPurpose: { readonly __typename?: 'ExercisePurpose', readonly label: string } | null, readonly secondaryPurpose: { readonly __typename?: 'ExercisePurpose', readonly label: string } | null } | { readonly __typename: 'Travel', readonly id: string, readonly start: string, readonly title: string } | null }> } } | null };

export type GetExcerciseTypeQueryVariables = Exact<{
  exerciseTypeId: Scalars['ID']['input'];
}>;


export type GetExcerciseTypeQuery = { readonly __typename?: 'Query', readonly exerciseType: { readonly __typename?: 'ExerciseType', readonly id: string, readonly name: string, readonly categoryTags: ReadonlyArray<{ readonly __typename?: 'CategoryTag', readonly id: string }> } | null, readonly categoryTags: ReadonlyArray<{ readonly __typename?: 'CategoryTag', readonly id: string, readonly name: string }> };

export type ExerciseTypesListQueryVariables = Exact<{ [key: string]: never; }>;


export type ExerciseTypesListQuery = { readonly __typename?: 'Query', readonly exerciseTypes: { readonly __typename?: 'ExerciseTypeConnection', readonly edges: ReadonlyArray<{ readonly __typename?: 'ExerciseTypeEdge', readonly cursor: string, readonly node: { readonly __typename?: 'ExerciseType', readonly id: string, readonly name: string, readonly defaultAmountType: AmountType, readonly loadTypes: ReadonlyArray<{ readonly __typename?: 'ExerciseLoadType', readonly id: string, readonly name: string, readonly unit: string | null }> } | null }> } };

export type ExerciseDetailsQueryVariables = Exact<{
  exerciseId: Scalars['ID']['input'];
}>;


export type ExerciseDetailsQuery = { readonly __typename?: 'Query', readonly exercise: { readonly __typename?: 'Exercise', readonly id: string, readonly start: string, readonly fromPlannedActivity: { readonly __typename?: 'PlannedExercise', readonly id: string, readonly exerciseItems: ReadonlyArray<{ readonly __typename?: 'PlannedExerciseItem', readonly exerciseType: { readonly __typename?: 'ExerciseType', readonly id: string, readonly name: string } | null }> } | null, readonly items: { readonly __typename?: 'ExerciseItemConnection', readonly edges: ReadonlyArray<{ readonly __typename?: 'ExerciseItemEdge', readonly cursor: string, readonly node: { readonly __typename?: 'ExerciseItem', readonly id: string, readonly exerciseType: { readonly __typename?: 'ExerciseType', readonly id: string, readonly name: string }, readonly amount: ReadonlyArray<{ readonly __typename: 'ExerciseAmount', readonly loads: ReadonlyArray<{ readonly __typename?: 'ExerciseLoad', readonly unit: string | null, readonly value: number, readonly type: { readonly __typename?: 'ExerciseLoadType', readonly name: string } }>, readonly duration: { readonly __typename: 'ExerciseDurationLevel', readonly levelType: { readonly __typename?: 'ExerciseTypeLevel', readonly name: string } } | { readonly __typename: 'ExerciseDurationRepetitions', readonly repetitions: number } | { readonly __typename: 'ExerciseDurationTime', readonly durationSeconds: number } }> } | null }> } } | null };

export type ExerciseExercisesQueryVariables = Exact<{
  exerciseId: Scalars['ID']['input'];
}>;


export type ExerciseExercisesQuery = { readonly __typename?: 'Query', readonly exercise: { readonly __typename?: 'Exercise', readonly id: string, readonly start: string, readonly fromPlannedActivity: { readonly __typename?: 'PlannedExercise', readonly id: string, readonly exerciseItems: ReadonlyArray<{ readonly __typename?: 'PlannedExerciseItem', readonly exerciseType: { readonly __typename?: 'ExerciseType', readonly id: string, readonly name: string } | null }> } | null, readonly items: { readonly __typename?: 'ExerciseItemConnection', readonly edges: ReadonlyArray<{ readonly __typename?: 'ExerciseItemEdge', readonly cursor: string, readonly node: { readonly __typename?: 'ExerciseItem', readonly id: string, readonly exerciseType: { readonly __typename?: 'ExerciseType', readonly id: string, readonly name: string }, readonly amount: ReadonlyArray<{ readonly __typename: 'ExerciseAmount', readonly loads: ReadonlyArray<{ readonly __typename?: 'ExerciseLoad', readonly unit: string | null, readonly value: number, readonly type: { readonly __typename?: 'ExerciseLoadType', readonly name: string } }>, readonly duration: { readonly __typename: 'ExerciseDurationLevel', readonly levelType: { readonly __typename?: 'ExerciseTypeLevel', readonly name: string } } | { readonly __typename: 'ExerciseDurationRepetitions', readonly repetitions: number } | { readonly __typename: 'ExerciseDurationTime', readonly durationSeconds: number } }> } | null }> } } | null };

export type CreateExerciseItemQueryVariables = Exact<{
  exerciseId: Scalars['ID']['input'];
}>;


export type CreateExerciseItemQuery = { readonly __typename?: 'Query', readonly exercise: { readonly __typename?: 'Exercise', readonly id: string, readonly items: { readonly __typename?: 'ExerciseItemConnection', readonly edges: ReadonlyArray<{ readonly __typename?: 'ExerciseItemEdge', readonly node: { readonly __typename?: 'ExerciseItem', readonly id: string, readonly exerciseType: { readonly __typename?: 'ExerciseType', readonly id: string } } | null }> } } | null, readonly exerciseTypes: { readonly __typename?: 'ExerciseTypeConnection', readonly edges: ReadonlyArray<{ readonly __typename?: 'ExerciseTypeEdge', readonly node: { readonly __typename?: 'ExerciseType', readonly id: string, readonly name: string, readonly defaultAmountType: AmountType, readonly loadTypes: ReadonlyArray<{ readonly __typename?: 'ExerciseLoadType', readonly id: string, readonly name: string, readonly unit: string | null, readonly commonLoads: ReadonlyArray<{ readonly __typename?: 'ExerciseLoad', readonly value: number }> }>, readonly levels: ReadonlyArray<{ readonly __typename?: 'ExerciseTypeLevel', readonly id: string, readonly name: string }>, readonly lastExerciseItem: { readonly __typename?: 'ExerciseItem', readonly amount: ReadonlyArray<{ readonly __typename?: 'ExerciseAmount', readonly loads: ReadonlyArray<{ readonly __typename: 'ExerciseLoad', readonly value: number, readonly unit: string | null, readonly type: { readonly __typename?: 'ExerciseLoadType', readonly id: string } }>, readonly duration: { readonly __typename: 'ExerciseDurationLevel' } | { readonly __typename: 'ExerciseDurationRepetitions', readonly repetitions: number } | { readonly __typename: 'ExerciseDurationTime', readonly durationSeconds: number } }> } | null } | null }> } };

export type ExercisePlanQueryVariables = Exact<{
  exerciseId: Scalars['ID']['input'];
}>;


export type ExercisePlanQuery = { readonly __typename?: 'Query', readonly exercise: { readonly __typename?: 'Exercise', readonly id: string, readonly start: string, readonly fromPlannedActivity: { readonly __typename?: 'PlannedExercise', readonly id: string, readonly exerciseItems: ReadonlyArray<{ readonly __typename?: 'PlannedExerciseItem', readonly exerciseType: { readonly __typename?: 'ExerciseType', readonly id: string, readonly name: string } | null }> } | null, readonly items: { readonly __typename?: 'ExerciseItemConnection', readonly edges: ReadonlyArray<{ readonly __typename?: 'ExerciseItemEdge', readonly cursor: string, readonly node: { readonly __typename?: 'ExerciseItem', readonly id: string, readonly exerciseType: { readonly __typename?: 'ExerciseType', readonly id: string, readonly name: string }, readonly amount: ReadonlyArray<{ readonly __typename: 'ExerciseAmount', readonly loads: ReadonlyArray<{ readonly __typename?: 'ExerciseLoad', readonly unit: string | null, readonly value: number, readonly type: { readonly __typename?: 'ExerciseLoadType', readonly name: string } }>, readonly duration: { readonly __typename: 'ExerciseDurationLevel', readonly levelType: { readonly __typename?: 'ExerciseTypeLevel', readonly name: string } } | { readonly __typename: 'ExerciseDurationRepetitions', readonly repetitions: number } | { readonly __typename: 'ExerciseDurationTime', readonly durationSeconds: number } }> } | null }> } } | null };

export type ExerciseTimelineQueryVariables = Exact<{
  exerciseId: Scalars['ID']['input'];
}>;


export type ExerciseTimelineQuery = { readonly __typename?: 'Query', readonly me: { readonly __typename?: 'User', readonly maxPulse: number | null } | null, readonly exercise: { readonly __typename?: 'Exercise', readonly id: string, readonly heartRateSummary: { readonly __typename?: 'HeartRateSummary', readonly samples: ReadonlyArray<{ readonly __typename?: 'HeartRateSample', readonly time: string, readonly heartRate: number | null }> } } | null };

export type ExerciseLayoutQueryVariables = Exact<{
  exerciseId: Scalars['ID']['input'];
}>;


export type ExerciseLayoutQuery = { readonly __typename?: 'Query', readonly timeZone: string, readonly exercise: { readonly __typename?: 'Exercise', readonly id: string, readonly start: string, readonly fromPlannedActivity: { readonly __typename?: 'PlannedExercise', readonly id: string } | null } | null };

export type GameQueryVariables = Exact<{
  gameId: Scalars['ID']['input'];
}>;


export type GameQuery = { readonly __typename?: 'Query', readonly timeZone: string, readonly game: { readonly __typename?: 'CustomGame', readonly id: string, readonly title: string, readonly start: string, readonly startDay: { readonly __typename?: 'Day', readonly heartRateSummary: { readonly __typename?: 'HeartRateSummary', readonly zone1: number | null, readonly zone2: number | null, readonly zone3: number | null, readonly zone4: number | null, readonly zone5: number | null, readonly samples: ReadonlyArray<{ readonly __typename?: 'HeartRateSample', readonly time: string, readonly heartRate: number | null }> } | null, readonly events: ReadonlyArray<{ readonly __typename?: 'Event', readonly time: string, readonly description: string }> } } | { readonly __typename?: 'FogisGame', readonly id: string, readonly title: string, readonly start: string, readonly startDay: { readonly __typename?: 'Day', readonly heartRateSummary: { readonly __typename?: 'HeartRateSummary', readonly zone1: number | null, readonly zone2: number | null, readonly zone3: number | null, readonly zone4: number | null, readonly zone5: number | null, readonly samples: ReadonlyArray<{ readonly __typename?: 'HeartRateSample', readonly time: string, readonly heartRate: number | null }> } | null, readonly events: ReadonlyArray<{ readonly __typename?: 'Event', readonly time: string, readonly description: string }> } } | null };

export type GoalDetailsQueryVariables = Exact<{
  goalId: Scalars['ID']['input'];
}>;


export type GoalDetailsQuery = { readonly __typename?: 'Query', readonly timeZone: string, readonly goal: { readonly __typename: 'GoalDayOfRest', readonly id: string, readonly title: string, readonly currentProgress: number, readonly currentPeriodStart: string, readonly currentPeriodEnd: string, readonly currentDaysOfRest: number, readonly targetDaysOfRest: number } | { readonly __typename: 'GoalDayOfWork', readonly id: string, readonly title: string, readonly currentProgress: number, readonly currentPeriodStart: string, readonly currentPeriodEnd: string, readonly currentDaysOfWork: number, readonly targetDaysOfWork: number } | { readonly __typename: 'GoalGeneric', readonly id: string, readonly title: string, readonly currentProgress: number | null, readonly currentPeriodStart: string, readonly currentPeriodEnd: string } | { readonly __typename: 'GoalPerformExerciseType', readonly id: string, readonly title: string, readonly currentProgress: number, readonly currentPeriodStart: string, readonly currentPeriodEnd: string, readonly targetDayCount: number, readonly currentDayCount: number } | null };

export type PlannedActivityQueryVariables = Exact<{
  plannedActivityId: Scalars['ID']['input'];
}>;


export type PlannedActivityQuery = { readonly __typename?: 'Query', readonly plannedExercise: { readonly __typename?: 'PlannedExercise', readonly id: string, readonly start: string, readonly primaryPurpose: { readonly __typename?: 'ExercisePurpose', readonly label: string } | null, readonly secondaryPurpose: { readonly __typename?: 'ExercisePurpose', readonly label: string } | null, readonly exerciseItems: ReadonlyArray<{ readonly __typename?: 'PlannedExerciseItem', readonly id: string, readonly exerciseType: { readonly __typename?: 'ExerciseType', readonly id: string, readonly name: string, readonly defaultAmountType: AmountType, readonly loadTypes: ReadonlyArray<{ readonly __typename?: 'ExerciseLoadType', readonly id: string, readonly name: string, readonly unit: string | null }> } | null }> } | null };

export type PlannedActivityExercisesQueryVariables = Exact<{
  plannedActivityId: Scalars['ID']['input'];
}>;


export type PlannedActivityExercisesQuery = { readonly __typename?: 'Query', readonly plannedExercise: { readonly __typename?: 'PlannedExercise', readonly id: string, readonly start: string, readonly primaryPurpose: { readonly __typename?: 'ExercisePurpose', readonly label: string } | null, readonly secondaryPurpose: { readonly __typename?: 'ExercisePurpose', readonly label: string } | null, readonly exerciseItems: ReadonlyArray<{ readonly __typename?: 'PlannedExerciseItem', readonly id: string, readonly exerciseType: { readonly __typename?: 'ExerciseType', readonly id: string, readonly name: string, readonly defaultAmountType: AmountType, readonly loadTypes: ReadonlyArray<{ readonly __typename?: 'ExerciseLoadType', readonly id: string, readonly name: string, readonly unit: string | null }> } | null }> } | null, readonly exerciseTypes: { readonly __typename?: 'ExerciseTypeConnection', readonly edges: ReadonlyArray<{ readonly __typename?: 'ExerciseTypeEdge', readonly cursor: string, readonly node: { readonly __typename?: 'ExerciseType', readonly id: string, readonly name: string, readonly defaultAmountType: AmountType, readonly loadTypes: ReadonlyArray<{ readonly __typename?: 'ExerciseLoadType', readonly id: string, readonly name: string, readonly unit: string | null }> } | null }> } };

export type StatsExerciseTypeQueryVariables = Exact<{
  exerciseTypeId: Scalars['ID']['input'];
}>;


export type StatsExerciseTypeQuery = { readonly __typename?: 'Query', readonly exerciseType: { readonly __typename?: 'ExerciseType', readonly id: string, readonly name: string, readonly history: { readonly __typename?: 'ExerciseTypeHistory', readonly dayAmounts: ReadonlyArray<{ readonly __typename?: 'ExerciseTypeHistoryDayAmount', readonly dayStart: string, readonly dayAmounts: ReadonlyArray<{ readonly __typename?: 'ExerciseAmount', readonly duration: { readonly __typename: 'ExerciseDurationLevel', readonly levelType: { readonly __typename?: 'ExerciseTypeLevel', readonly name: string, readonly ordinal: number } } | { readonly __typename: 'ExerciseDurationRepetitions', readonly repetitions: number } | { readonly __typename: 'ExerciseDurationTime', readonly durationSeconds: number }, readonly loads: ReadonlyArray<{ readonly __typename?: 'ExerciseLoad', readonly value: number, readonly unit: string | null, readonly type: { readonly __typename?: 'ExerciseLoadType', readonly id: string, readonly name: string } }> }> }> } } | null };

export type StatsExercisesQueryVariables = Exact<{ [key: string]: never; }>;


export type StatsExercisesQuery = { readonly __typename?: 'Query', readonly exerciseTypes: { readonly __typename?: 'ExerciseTypeConnection', readonly edges: ReadonlyArray<{ readonly __typename?: 'ExerciseTypeEdge', readonly cursor: string, readonly node: { readonly __typename?: 'ExerciseType', readonly id: string, readonly name: string } | null }> } };

type BottomMenuCurrentActivity_CustomGame_Fragment = { readonly __typename: 'CustomGame' };

type BottomMenuCurrentActivity_Exercise_Fragment = { readonly __typename: 'Exercise', readonly id: string };

type BottomMenuCurrentActivity_FogisGame_Fragment = { readonly __typename: 'FogisGame' };

type BottomMenuCurrentActivity_PhysicalTest_Fragment = { readonly __typename: 'PhysicalTest' };

type BottomMenuCurrentActivity_PlannedExercise_Fragment = { readonly __typename: 'PlannedExercise' };

type BottomMenuCurrentActivity_Travel_Fragment = { readonly __typename: 'Travel' };

export type BottomMenuCurrentActivityFragment = BottomMenuCurrentActivity_CustomGame_Fragment | BottomMenuCurrentActivity_Exercise_Fragment | BottomMenuCurrentActivity_FogisGame_Fragment | BottomMenuCurrentActivity_PhysicalTest_Fragment | BottomMenuCurrentActivity_PlannedExercise_Fragment | BottomMenuCurrentActivity_Travel_Fragment;

export type DashboardQueryVariables = Exact<{ [key: string]: never; }>;


export type DashboardQuery = { readonly __typename?: 'Query', readonly me: { readonly __typename?: 'User', readonly email: string } | null, readonly currentActivity: { readonly __typename: 'CustomGame' } | { readonly __typename: 'Exercise', readonly id: string } | { readonly __typename: 'FogisGame' } | { readonly __typename: 'PhysicalTest' } | { readonly __typename: 'PlannedExercise' } | { readonly __typename: 'Travel' } | null };

export type ComponentExerciseTypeSelectorQueryVariables = Exact<{
  search: Scalars['String']['input'];
}>;


export type ComponentExerciseTypeSelectorQuery = { readonly __typename?: 'Query', readonly exerciseTypes: { readonly __typename?: 'ExerciseTypeConnection', readonly edges: ReadonlyArray<{ readonly __typename?: 'ExerciseTypeEdge', readonly node: { readonly __typename?: 'ExerciseType', readonly id: string, readonly name: string } | null }> } };

export const CalendarActivityFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CalendarActivity"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Activity"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ActivityBase"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"start"}},{"kind":"Field","name":{"kind":"Name","value":"title"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"PhysicalTest"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"FogisGame"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"homeTeam"}},{"kind":"Field","name":{"kind":"Name","value":"awayTeam"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Exercise"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"isHiddenFromOverview"}},{"kind":"Field","name":{"kind":"Name","value":"primaryPurpose"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"label"}},{"kind":"Field","name":{"kind":"Name","value":"shortLabel"}}]}},{"kind":"Field","name":{"kind":"Name","value":"secondaryPurpose"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"label"}},{"kind":"Field","name":{"kind":"Name","value":"shortLabel"}}]}},{"kind":"Field","name":{"kind":"Name","value":"comment"}},{"kind":"Field","name":{"kind":"Name","value":"description"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"PlannedExercise"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"primaryPurpose"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"label"}},{"kind":"Field","name":{"kind":"Name","value":"shortLabel"}}]}},{"kind":"Field","name":{"kind":"Name","value":"secondaryPurpose"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"label"}},{"kind":"Field","name":{"kind":"Name","value":"shortLabel"}}]}}]}}]}}]} as unknown as DocumentNode<CalendarActivityFragment, unknown>;
export const CalendarDayFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CalendarDay"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Day"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"start"}},{"kind":"Field","name":{"kind":"Name","value":"date"}},{"kind":"Field","name":{"kind":"Name","value":"heartRateSummary"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"secondsInZone4"},"name":{"kind":"Name","value":"secondsInZone"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"heartRateZone"},"value":{"kind":"EnumValue","value":"Zone4"}}]},{"kind":"Field","alias":{"kind":"Name","value":"secondsInZone5"},"name":{"kind":"Name","value":"secondsInZone"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"heartRateZone"},"value":{"kind":"EnumValue","value":"Zone5"}}]}]}},{"kind":"Field","name":{"kind":"Name","value":"activities"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"edges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cursor"}},{"kind":"Field","name":{"kind":"Name","value":"node"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"CalendarActivity"}}]}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CalendarActivity"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Activity"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ActivityBase"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"start"}},{"kind":"Field","name":{"kind":"Name","value":"title"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"PhysicalTest"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"FogisGame"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"homeTeam"}},{"kind":"Field","name":{"kind":"Name","value":"awayTeam"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Exercise"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"isHiddenFromOverview"}},{"kind":"Field","name":{"kind":"Name","value":"primaryPurpose"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"label"}},{"kind":"Field","name":{"kind":"Name","value":"shortLabel"}}]}},{"kind":"Field","name":{"kind":"Name","value":"secondaryPurpose"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"label"}},{"kind":"Field","name":{"kind":"Name","value":"shortLabel"}}]}},{"kind":"Field","name":{"kind":"Name","value":"comment"}},{"kind":"Field","name":{"kind":"Name","value":"description"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"PlannedExercise"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"primaryPurpose"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"label"}},{"kind":"Field","name":{"kind":"Name","value":"shortLabel"}}]}},{"kind":"Field","name":{"kind":"Name","value":"secondaryPurpose"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"label"}},{"kind":"Field","name":{"kind":"Name","value":"shortLabel"}}]}}]}}]}}]} as unknown as DocumentNode<CalendarDayFragment, unknown>;
export const BottomMenuCurrentActivityFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"BottomMenuCurrentActivity"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Activity"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Exercise"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<BottomMenuCurrentActivityFragment, unknown>;
export const DashboardOverviewDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"DashboardOverview"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"timeZone"}},{"kind":"Field","name":{"kind":"Name","value":"goals"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"GoalBase"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"currentProgress"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"GoalPerformExerciseType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"currentDayCount"}},{"kind":"Field","name":{"kind":"Name","value":"targetDayCount"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"GoalDayOfRest"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"currentDaysOfRest"}},{"kind":"Field","name":{"kind":"Name","value":"targetDaysOfRest"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"GoalDayOfWork"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"currentDaysOfWork"}},{"kind":"Field","name":{"kind":"Name","value":"targetDaysOfWork"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"upcomingPlannedExercise"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"start"}},{"kind":"Field","name":{"kind":"Name","value":"primaryPurpose"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"label"}}]}},{"kind":"Field","name":{"kind":"Name","value":"secondaryPurpose"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"label"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"lastActivity"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ActivityBase"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"start"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Exercise"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"primaryPurpose"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"label"}}]}},{"kind":"Field","name":{"kind":"Name","value":"secondaryPurpose"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"label"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"currentActivity"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ActivityBase"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"start"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Exercise"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"primaryPurpose"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"label"}}]}},{"kind":"Field","name":{"kind":"Name","value":"secondaryPurpose"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"label"}}]}}]}}]}}]}}]} as unknown as DocumentNode<DashboardOverviewQuery, DashboardOverviewQueryVariables>;
export const ActionsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Actions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"currentActivity"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Exercise"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"today"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"activities"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"edges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"node"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ActivityBase"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}}]}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<ActionsQuery, ActionsQueryVariables>;
export const CalendarDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Calendar"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"after"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"before"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"days"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"after"},"value":{"kind":"Variable","name":{"kind":"Name","value":"after"}}},{"kind":"Argument","name":{"kind":"Name","value":"before"},"value":{"kind":"Variable","name":{"kind":"Name","value":"before"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"edges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cursor"}},{"kind":"Field","name":{"kind":"Name","value":"node"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"CalendarDay"}}]}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CalendarActivity"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Activity"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ActivityBase"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"start"}},{"kind":"Field","name":{"kind":"Name","value":"title"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"PhysicalTest"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"FogisGame"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"homeTeam"}},{"kind":"Field","name":{"kind":"Name","value":"awayTeam"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Exercise"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"isHiddenFromOverview"}},{"kind":"Field","name":{"kind":"Name","value":"primaryPurpose"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"label"}},{"kind":"Field","name":{"kind":"Name","value":"shortLabel"}}]}},{"kind":"Field","name":{"kind":"Name","value":"secondaryPurpose"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"label"}},{"kind":"Field","name":{"kind":"Name","value":"shortLabel"}}]}},{"kind":"Field","name":{"kind":"Name","value":"comment"}},{"kind":"Field","name":{"kind":"Name","value":"description"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"PlannedExercise"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"primaryPurpose"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"label"}},{"kind":"Field","name":{"kind":"Name","value":"shortLabel"}}]}},{"kind":"Field","name":{"kind":"Name","value":"secondaryPurpose"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"label"}},{"kind":"Field","name":{"kind":"Name","value":"shortLabel"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CalendarDay"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Day"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"start"}},{"kind":"Field","name":{"kind":"Name","value":"date"}},{"kind":"Field","name":{"kind":"Name","value":"heartRateSummary"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"secondsInZone4"},"name":{"kind":"Name","value":"secondsInZone"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"heartRateZone"},"value":{"kind":"EnumValue","value":"Zone4"}}]},{"kind":"Field","alias":{"kind":"Name","value":"secondsInZone5"},"name":{"kind":"Name","value":"secondsInZone"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"heartRateZone"},"value":{"kind":"EnumValue","value":"Zone5"}}]}]}},{"kind":"Field","name":{"kind":"Name","value":"activities"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"edges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cursor"}},{"kind":"Field","name":{"kind":"Name","value":"node"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"CalendarActivity"}}]}}]}}]}}]}}]} as unknown as DocumentNode<CalendarQuery, CalendarQueryVariables>;
export const ShowDayDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ShowDay"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"date"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"day"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"date"},"value":{"kind":"Variable","name":{"kind":"Name","value":"date"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"activities"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"edges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"node"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ActivityBase"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"start"}},{"kind":"Field","name":{"kind":"Name","value":"title"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"FogisGame"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"homeTeam"}},{"kind":"Field","name":{"kind":"Name","value":"awayTeam"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"PlannedExercise"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"primaryPurpose"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"label"}}]}},{"kind":"Field","name":{"kind":"Name","value":"secondaryPurpose"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"label"}}]}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"comment"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Exercise"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"primaryPurpose"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"label"}}]}},{"kind":"Field","name":{"kind":"Name","value":"secondaryPurpose"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"label"}}]}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"comment"}},{"kind":"Field","name":{"kind":"Name","value":"isHiddenFromOverview"}}]}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<ShowDayQuery, ShowDayQueryVariables>;
export const GetExcerciseTypeDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetExcerciseType"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"exerciseTypeId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"exerciseType"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"exerciseTypeId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"categoryTags"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"categoryTags"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<GetExcerciseTypeQuery, GetExcerciseTypeQueryVariables>;
export const ExerciseTypesListDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ExerciseTypesList"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"exerciseTypes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"edges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cursor"}},{"kind":"Field","name":{"kind":"Name","value":"node"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"defaultAmountType"}},{"kind":"Field","name":{"kind":"Name","value":"loadTypes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"unit"}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<ExerciseTypesListQuery, ExerciseTypesListQueryVariables>;
export const ExerciseDetailsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ExerciseDetails"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"exerciseId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"exercise"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"exerciseId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"start"}},{"kind":"Field","name":{"kind":"Name","value":"fromPlannedActivity"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"exerciseItems"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"exerciseType"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"edges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cursor"}},{"kind":"Field","name":{"kind":"Name","value":"node"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"exerciseType"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"amount"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"loads"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"unit"}},{"kind":"Field","name":{"kind":"Name","value":"value"}},{"kind":"Field","name":{"kind":"Name","value":"type"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"duration"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ExerciseDurationRepetitions"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"repetitions"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ExerciseDurationTime"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"durationSeconds"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ExerciseDurationLevel"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"levelType"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<ExerciseDetailsQuery, ExerciseDetailsQueryVariables>;
export const ExerciseExercisesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ExerciseExercises"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"exerciseId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"exercise"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"exerciseId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"start"}},{"kind":"Field","name":{"kind":"Name","value":"fromPlannedActivity"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"exerciseItems"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"exerciseType"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"edges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cursor"}},{"kind":"Field","name":{"kind":"Name","value":"node"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"exerciseType"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"amount"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"loads"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"unit"}},{"kind":"Field","name":{"kind":"Name","value":"value"}},{"kind":"Field","name":{"kind":"Name","value":"type"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"duration"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ExerciseDurationRepetitions"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"repetitions"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ExerciseDurationTime"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"durationSeconds"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ExerciseDurationLevel"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"levelType"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<ExerciseExercisesQuery, ExerciseExercisesQueryVariables>;
export const CreateExerciseItemDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"CreateExerciseItem"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"exerciseId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"exercise"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"exerciseId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"edges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"node"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"exerciseType"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"exerciseTypes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"edges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"node"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"defaultAmountType"}},{"kind":"Field","name":{"kind":"Name","value":"loadTypes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"unit"}},{"kind":"Field","name":{"kind":"Name","value":"commonLoads"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"value"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"levels"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"lastExerciseItem"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"amount"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"loads"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"value"}},{"kind":"Field","name":{"kind":"Name","value":"unit"}},{"kind":"Field","name":{"kind":"Name","value":"type"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"duration"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ExerciseDurationRepetitions"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"repetitions"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ExerciseDurationTime"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"durationSeconds"}}]}}]}}]}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<CreateExerciseItemQuery, CreateExerciseItemQueryVariables>;
export const ExercisePlanDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ExercisePlan"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"exerciseId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"exercise"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"exerciseId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"start"}},{"kind":"Field","name":{"kind":"Name","value":"fromPlannedActivity"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"exerciseItems"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"exerciseType"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"edges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cursor"}},{"kind":"Field","name":{"kind":"Name","value":"node"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"exerciseType"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"amount"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"loads"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"unit"}},{"kind":"Field","name":{"kind":"Name","value":"value"}},{"kind":"Field","name":{"kind":"Name","value":"type"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"duration"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ExerciseDurationRepetitions"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"repetitions"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ExerciseDurationTime"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"durationSeconds"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ExerciseDurationLevel"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"levelType"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<ExercisePlanQuery, ExercisePlanQueryVariables>;
export const ExerciseTimelineDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ExerciseTimeline"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"exerciseId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"me"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"maxPulse"}}]}},{"kind":"Field","name":{"kind":"Name","value":"exercise"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"exerciseId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"heartRateSummary"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"samples"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"time"}},{"kind":"Field","name":{"kind":"Name","value":"heartRate"}}]}}]}}]}}]}}]} as unknown as DocumentNode<ExerciseTimelineQuery, ExerciseTimelineQueryVariables>;
export const ExerciseLayoutDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ExerciseLayout"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"exerciseId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"timeZone"}},{"kind":"Field","name":{"kind":"Name","value":"exercise"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"exerciseId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"start"}},{"kind":"Field","name":{"kind":"Name","value":"fromPlannedActivity"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]} as unknown as DocumentNode<ExerciseLayoutQuery, ExerciseLayoutQueryVariables>;
export const GameDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Game"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"gameId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"timeZone"}},{"kind":"Field","name":{"kind":"Name","value":"game"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"gameId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ActivityBase"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"startDay"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"heartRateSummary"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"zone1"},"name":{"kind":"Name","value":"secondsInZone"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"heartRateZone"},"value":{"kind":"EnumValue","value":"Zone1"}}]},{"kind":"Field","alias":{"kind":"Name","value":"zone2"},"name":{"kind":"Name","value":"secondsInZone"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"heartRateZone"},"value":{"kind":"EnumValue","value":"Zone2"}}]},{"kind":"Field","alias":{"kind":"Name","value":"zone3"},"name":{"kind":"Name","value":"secondsInZone"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"heartRateZone"},"value":{"kind":"EnumValue","value":"Zone3"}}]},{"kind":"Field","alias":{"kind":"Name","value":"zone4"},"name":{"kind":"Name","value":"secondsInZone"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"heartRateZone"},"value":{"kind":"EnumValue","value":"Zone4"}}]},{"kind":"Field","alias":{"kind":"Name","value":"zone5"},"name":{"kind":"Name","value":"secondsInZone"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"heartRateZone"},"value":{"kind":"EnumValue","value":"Zone5"}}]},{"kind":"Field","name":{"kind":"Name","value":"samples"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"time"}},{"kind":"Field","name":{"kind":"Name","value":"heartRate"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"events"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"time"}},{"kind":"Field","name":{"kind":"Name","value":"description"}}]}}]}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ActivityGame"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ActivityBase"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"start"}}]}}]}}]}}]} as unknown as DocumentNode<GameQuery, GameQueryVariables>;
export const GoalDetailsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GoalDetails"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"goalId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"timeZone"}},{"kind":"Field","name":{"kind":"Name","value":"goal"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"goalId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"GoalBase"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"currentProgress"}},{"kind":"Field","name":{"kind":"Name","value":"currentPeriodStart"}},{"kind":"Field","name":{"kind":"Name","value":"currentPeriodEnd"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"GoalDayOfRest"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"currentDaysOfRest"}},{"kind":"Field","name":{"kind":"Name","value":"targetDaysOfRest"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"GoalDayOfWork"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"currentDaysOfWork"}},{"kind":"Field","name":{"kind":"Name","value":"targetDaysOfWork"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"GoalPerformExerciseType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"targetDayCount"}},{"kind":"Field","name":{"kind":"Name","value":"currentDayCount"}}]}}]}}]}}]} as unknown as DocumentNode<GoalDetailsQuery, GoalDetailsQueryVariables>;
export const PlannedActivityDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"PlannedActivity"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"plannedActivityId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"plannedExercise"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"plannedActivityId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"start"}},{"kind":"Field","name":{"kind":"Name","value":"primaryPurpose"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"label"}}]}},{"kind":"Field","name":{"kind":"Name","value":"secondaryPurpose"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"label"}}]}},{"kind":"Field","name":{"kind":"Name","value":"exerciseItems"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"exerciseType"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"defaultAmountType"}},{"kind":"Field","name":{"kind":"Name","value":"loadTypes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"unit"}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<PlannedActivityQuery, PlannedActivityQueryVariables>;
export const PlannedActivityExercisesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"PlannedActivityExercises"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"plannedActivityId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"plannedExercise"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"plannedActivityId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"start"}},{"kind":"Field","name":{"kind":"Name","value":"primaryPurpose"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"label"}}]}},{"kind":"Field","name":{"kind":"Name","value":"secondaryPurpose"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"label"}}]}},{"kind":"Field","name":{"kind":"Name","value":"exerciseItems"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"exerciseType"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"defaultAmountType"}},{"kind":"Field","name":{"kind":"Name","value":"loadTypes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"unit"}}]}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"exerciseTypes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"edges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cursor"}},{"kind":"Field","name":{"kind":"Name","value":"node"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"defaultAmountType"}},{"kind":"Field","name":{"kind":"Name","value":"loadTypes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"unit"}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<PlannedActivityExercisesQuery, PlannedActivityExercisesQueryVariables>;
export const StatsExerciseTypeDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"StatsExerciseType"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"exerciseTypeId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"exerciseType"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"exerciseTypeId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"history"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"dayAmounts"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"dayStart"}},{"kind":"Field","name":{"kind":"Name","value":"dayAmounts"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"duration"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ExerciseDurationTime"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"durationSeconds"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ExerciseDurationRepetitions"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"repetitions"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ExerciseDurationLevel"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"levelType"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"ordinal"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"loads"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"type"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"value"}},{"kind":"Field","name":{"kind":"Name","value":"unit"}}]}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<StatsExerciseTypeQuery, StatsExerciseTypeQueryVariables>;
export const StatsExercisesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"StatsExercises"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"exerciseTypes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"edges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cursor"}},{"kind":"Field","name":{"kind":"Name","value":"node"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]}}]} as unknown as DocumentNode<StatsExercisesQuery, StatsExercisesQueryVariables>;
export const DashboardDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Dashboard"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"me"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"email"}}]}},{"kind":"Field","name":{"kind":"Name","value":"currentActivity"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"BottomMenuCurrentActivity"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"BottomMenuCurrentActivity"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Activity"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Exercise"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<DashboardQuery, DashboardQueryVariables>;
export const ComponentExerciseTypeSelectorDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ComponentExerciseTypeSelector"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"search"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"exerciseTypes"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"search"},"value":{"kind":"Variable","name":{"kind":"Name","value":"search"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"edges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"node"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]}}]} as unknown as DocumentNode<ComponentExerciseTypeSelectorQuery, ComponentExerciseTypeSelectorQueryVariables>;