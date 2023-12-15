import { DateTime } from 'luxon';
import { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
import { ActivityModel } from '../types/activity/model';
import { CustomGameModel } from '../types/custom-game/model';
import { DayModel } from '../types/day/model';
import { ExerciseModel } from '../types/exercise/model';
import { ExerciseAmountModel } from '../types/exercise-amount/model';
import { ExerciseItemModel } from '../types/exercise-item/model';
import { ExerciseLoadTypeModel } from '../types/exercise-load-type/model';
import { ExercisePurposeModel } from '../types/exercise-purpose/model';
import { ExerciseTypeModel } from '../types/exercise-type/model';
import { ExerciseTypeHistoryModel } from '../types/exercise-type-history/model';
import { ExerciseTypeHistoryDayAmountModel } from '../types/exercise-type-history-day-amount/model';
import { FogisGameModel } from '../types/fogis-game/model';
import { HeartRateSummaryModel } from '../types/heart-rate-summary/model';
import { PhysicalTestModel } from '../types/physical-test/model';
import { PlannedExerciseModel } from '../types/planned-exercise/model';
import { UserModel } from '../types/user/model';
import { Context } from '../context';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type RequireFields<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string | number; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  DateTime: { input: DateTime; output: DateTime; }
};

export type Activity = CustomGame | Exercise | FogisGame | PhysicalTest | PlannedExercise;

export type ActivityBase = {
  id: Scalars['ID']['output'];
  start: Scalars['DateTime']['output'];
  title: Scalars['String']['output'];
};

export type ActivityConnection = {
  __typename?: 'ActivityConnection';
  edges: Array<ActivityEdge>;
  pageInfo: PageInfo;
};

export type ActivityEdge = {
  __typename?: 'ActivityEdge';
  cursor: Scalars['String']['output'];
  node: Maybe<Activity>;
};

export type ActivityFilter = {
  startFrom: InputMaybe<Scalars['DateTime']['input']>;
  startTo: InputMaybe<Scalars['DateTime']['input']>;
};

export enum AmountType {
  Repetitions = 'Repetitions',
  Time = 'Time'
}

export type CustomGame = ActivityBase & {
  __typename?: 'CustomGame';
  id: Scalars['ID']['output'];
  start: Scalars['DateTime']['output'];
  title: Scalars['String']['output'];
};

export type Day = {
  __typename?: 'Day';
  activities: ActivityConnection;
  date: Scalars['String']['output'];
  heartRateSummary: Maybe<HeartRateSummary>;
  start: Scalars['DateTime']['output'];
};


export type DayActivitiesArgs = {
  after: InputMaybe<Scalars['String']['input']>;
  before: InputMaybe<Scalars['String']['input']>;
  first: InputMaybe<Scalars['Int']['input']>;
  includeHidden: InputMaybe<Scalars['Boolean']['input']>;
  last: InputMaybe<Scalars['Int']['input']>;
};

export type DayConnection = {
  __typename?: 'DayConnection';
  edges: Array<DayEdge>;
  pageInfo: PageInfo;
};

export type DayEdge = {
  __typename?: 'DayEdge';
  cursor: Scalars['String']['output'];
  node: Maybe<Day>;
};

export type Exercise = ActivityBase & {
  __typename?: 'Exercise';
  comment: Maybe<Scalars['String']['output']>;
  description: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  isHiddenFromOverview: Scalars['Boolean']['output'];
  items: ExerciseItemConnection;
  primaryPurpose: Maybe<ExercisePurpose>;
  secondaryPurpose: Maybe<ExercisePurpose>;
  start: Scalars['DateTime']['output'];
  title: Scalars['String']['output'];
};

export type ExerciseAmount = {
  __typename?: 'ExerciseAmount';
  duration: ExerciseDuration;
  loads: Array<ExerciseLoad>;
};

export type ExerciseDuration = ExerciseDurationRepetitions | ExerciseDurationTime;

export type ExerciseDurationRepetitions = {
  __typename?: 'ExerciseDurationRepetitions';
  repetitions: Scalars['Int']['output'];
};

export type ExerciseDurationTime = {
  __typename?: 'ExerciseDurationTime';
  durationSeconds: Scalars['Float']['output'];
};

export type ExerciseItem = {
  __typename?: 'ExerciseItem';
  amount: Array<ExerciseAmount>;
  exercise: Exercise;
  exerciseType: ExerciseType;
  id: Scalars['ID']['output'];
};

export type ExerciseItemConnection = {
  __typename?: 'ExerciseItemConnection';
  edges: Array<ExerciseItemEdge>;
  pageInfo: PageInfo;
};

export type ExerciseItemEdge = {
  __typename?: 'ExerciseItemEdge';
  cursor: Scalars['String']['output'];
  node: Maybe<ExerciseItem>;
};

export type ExerciseLoad = {
  __typename?: 'ExerciseLoad';
  type: ExerciseLoadType;
  unit: Maybe<Scalars['String']['output']>;
  value: Scalars['Float']['output'];
};

export type ExerciseLoadType = {
  __typename?: 'ExerciseLoadType';
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  unit: Maybe<Scalars['String']['output']>;
};

export type ExercisePurpose = {
  __typename?: 'ExercisePurpose';
  label: Scalars['String']['output'];
  shortLabel: Maybe<Scalars['String']['output']>;
};

export type ExerciseType = {
  __typename?: 'ExerciseType';
  defaultAmountType: AmountType;
  history: ExerciseTypeHistory;
  id: Scalars['ID']['output'];
  loadTypes: Array<ExerciseLoadType>;
  name: Scalars['String']['output'];
};

export type ExerciseTypeConnection = {
  __typename?: 'ExerciseTypeConnection';
  edges: Array<ExerciseTypeEdge>;
  pageInfo: PageInfo;
};

export type ExerciseTypeEdge = {
  __typename?: 'ExerciseTypeEdge';
  cursor: Scalars['String']['output'];
  node: Maybe<ExerciseType>;
};

export type ExerciseTypeHistory = {
  __typename?: 'ExerciseTypeHistory';
  dayAmounts: Array<ExerciseTypeHistoryDayAmount>;
  name: Scalars['String']['output'];
};

export type ExerciseTypeHistoryDayAmount = {
  __typename?: 'ExerciseTypeHistoryDayAmount';
  dayAmounts: Array<ExerciseAmount>;
  dayStart: Scalars['DateTime']['output'];
};

export type FogisGame = ActivityBase & {
  __typename?: 'FogisGame';
  awayTeam: Scalars['String']['output'];
  homeTeam: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  start: Scalars['DateTime']['output'];
  title: Scalars['String']['output'];
};

export type HeartRateSummary = {
  __typename?: 'HeartRateSummary';
  secondsInZone: Maybe<Scalars['Int']['output']>;
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
  __typename?: 'PageInfo';
  endCursor: Maybe<Scalars['String']['output']>;
  hasNextPage: Scalars['Boolean']['output'];
  hasPreviousPage: Scalars['Boolean']['output'];
  startCursor: Maybe<Scalars['String']['output']>;
};

export type PhysicalTest = ActivityBase & {
  __typename?: 'PhysicalTest';
  id: Scalars['ID']['output'];
  start: Scalars['DateTime']['output'];
  title: Scalars['String']['output'];
};

export type PlannedExercise = ActivityBase & {
  __typename?: 'PlannedExercise';
  comment: Maybe<Scalars['String']['output']>;
  description: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  primaryPurpose: Maybe<ExercisePurpose>;
  secondaryPurpose: Maybe<ExercisePurpose>;
  start: Scalars['DateTime']['output'];
  title: Scalars['String']['output'];
};

export type Query = {
  __typename?: 'Query';
  activities: ActivityConnection;
  activity: Maybe<Activity>;
  day: Maybe<Day>;
  days: DayConnection;
  exercise: Maybe<Exercise>;
  exerciseType: Maybe<ExerciseType>;
  exerciseTypes: ExerciseTypeConnection;
  me: Maybe<User>;
  today: Day;
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

export type User = {
  __typename?: 'User';
  email: Scalars['String']['output'];
  id: Scalars['ID']['output'];
};



export type ResolverTypeWrapper<T> = Promise<T> | T;


export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> = ResolverFn<TResult, TParent, TContext, TArgs> | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

/** Mapping of union types */
export type ResolversUnionTypes<RefType extends Record<string, unknown>> = {
  Activity: ( CustomGameModel ) | ( ExerciseModel ) | ( FogisGameModel ) | ( PhysicalTestModel ) | ( PlannedExerciseModel );
  ExerciseDuration: ( ExerciseDurationRepetitions ) | ( ExerciseDurationTime );
};

/** Mapping of interface types */
export type ResolversInterfaceTypes<RefType extends Record<string, unknown>> = {
  ActivityBase: ( CustomGameModel ) | ( ExerciseModel ) | ( FogisGameModel ) | ( PhysicalTestModel ) | ( PlannedExerciseModel );
};

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  Activity: ResolverTypeWrapper<ActivityModel>;
  ActivityBase: ResolverTypeWrapper<ResolversInterfaceTypes<ResolversTypes>['ActivityBase']>;
  ActivityConnection: ResolverTypeWrapper<Omit<ActivityConnection, 'edges'> & { edges: Array<ResolversTypes['ActivityEdge']> }>;
  ActivityEdge: ResolverTypeWrapper<Omit<ActivityEdge, 'node'> & { node: Maybe<ResolversTypes['Activity']> }>;
  ActivityFilter: ActivityFilter;
  AmountType: AmountType;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']['output']>;
  CustomGame: ResolverTypeWrapper<CustomGameModel>;
  DateTime: ResolverTypeWrapper<Scalars['DateTime']['output']>;
  Day: ResolverTypeWrapper<DayModel>;
  DayConnection: ResolverTypeWrapper<Omit<DayConnection, 'edges'> & { edges: Array<ResolversTypes['DayEdge']> }>;
  DayEdge: ResolverTypeWrapper<Omit<DayEdge, 'node'> & { node: Maybe<ResolversTypes['Day']> }>;
  Exercise: ResolverTypeWrapper<ExerciseModel>;
  ExerciseAmount: ResolverTypeWrapper<ExerciseAmountModel>;
  ExerciseDuration: ResolverTypeWrapper<ResolversUnionTypes<ResolversTypes>['ExerciseDuration']>;
  ExerciseDurationRepetitions: ResolverTypeWrapper<ExerciseDurationRepetitions>;
  ExerciseDurationTime: ResolverTypeWrapper<ExerciseDurationTime>;
  ExerciseItem: ResolverTypeWrapper<ExerciseItemModel>;
  ExerciseItemConnection: ResolverTypeWrapper<Omit<ExerciseItemConnection, 'edges'> & { edges: Array<ResolversTypes['ExerciseItemEdge']> }>;
  ExerciseItemEdge: ResolverTypeWrapper<Omit<ExerciseItemEdge, 'node'> & { node: Maybe<ResolversTypes['ExerciseItem']> }>;
  ExerciseLoad: ResolverTypeWrapper<Omit<ExerciseLoad, 'type'> & { type: ResolversTypes['ExerciseLoadType'] }>;
  ExerciseLoadType: ResolverTypeWrapper<ExerciseLoadTypeModel>;
  ExercisePurpose: ResolverTypeWrapper<ExercisePurposeModel>;
  ExerciseType: ResolverTypeWrapper<ExerciseTypeModel>;
  ExerciseTypeConnection: ResolverTypeWrapper<Omit<ExerciseTypeConnection, 'edges'> & { edges: Array<ResolversTypes['ExerciseTypeEdge']> }>;
  ExerciseTypeEdge: ResolverTypeWrapper<Omit<ExerciseTypeEdge, 'node'> & { node: Maybe<ResolversTypes['ExerciseType']> }>;
  ExerciseTypeHistory: ResolverTypeWrapper<ExerciseTypeHistoryModel>;
  ExerciseTypeHistoryDayAmount: ResolverTypeWrapper<ExerciseTypeHistoryDayAmountModel>;
  Float: ResolverTypeWrapper<Scalars['Float']['output']>;
  FogisGame: ResolverTypeWrapper<FogisGameModel>;
  HeartRateSummary: ResolverTypeWrapper<HeartRateSummaryModel>;
  HeartRateZone: HeartRateZone;
  ID: ResolverTypeWrapper<Scalars['ID']['output']>;
  Int: ResolverTypeWrapper<Scalars['Int']['output']>;
  PageInfo: ResolverTypeWrapper<PageInfo>;
  PhysicalTest: ResolverTypeWrapper<PhysicalTestModel>;
  PlannedExercise: ResolverTypeWrapper<PlannedExerciseModel>;
  Query: ResolverTypeWrapper<{}>;
  String: ResolverTypeWrapper<Scalars['String']['output']>;
  User: ResolverTypeWrapper<UserModel>;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  Activity: ActivityModel;
  ActivityBase: ResolversInterfaceTypes<ResolversParentTypes>['ActivityBase'];
  ActivityConnection: Omit<ActivityConnection, 'edges'> & { edges: Array<ResolversParentTypes['ActivityEdge']> };
  ActivityEdge: Omit<ActivityEdge, 'node'> & { node: Maybe<ResolversParentTypes['Activity']> };
  ActivityFilter: ActivityFilter;
  Boolean: Scalars['Boolean']['output'];
  CustomGame: CustomGameModel;
  DateTime: Scalars['DateTime']['output'];
  Day: DayModel;
  DayConnection: Omit<DayConnection, 'edges'> & { edges: Array<ResolversParentTypes['DayEdge']> };
  DayEdge: Omit<DayEdge, 'node'> & { node: Maybe<ResolversParentTypes['Day']> };
  Exercise: ExerciseModel;
  ExerciseAmount: ExerciseAmountModel;
  ExerciseDuration: ResolversUnionTypes<ResolversParentTypes>['ExerciseDuration'];
  ExerciseDurationRepetitions: ExerciseDurationRepetitions;
  ExerciseDurationTime: ExerciseDurationTime;
  ExerciseItem: ExerciseItemModel;
  ExerciseItemConnection: Omit<ExerciseItemConnection, 'edges'> & { edges: Array<ResolversParentTypes['ExerciseItemEdge']> };
  ExerciseItemEdge: Omit<ExerciseItemEdge, 'node'> & { node: Maybe<ResolversParentTypes['ExerciseItem']> };
  ExerciseLoad: Omit<ExerciseLoad, 'type'> & { type: ResolversParentTypes['ExerciseLoadType'] };
  ExerciseLoadType: ExerciseLoadTypeModel;
  ExercisePurpose: ExercisePurposeModel;
  ExerciseType: ExerciseTypeModel;
  ExerciseTypeConnection: Omit<ExerciseTypeConnection, 'edges'> & { edges: Array<ResolversParentTypes['ExerciseTypeEdge']> };
  ExerciseTypeEdge: Omit<ExerciseTypeEdge, 'node'> & { node: Maybe<ResolversParentTypes['ExerciseType']> };
  ExerciseTypeHistory: ExerciseTypeHistoryModel;
  ExerciseTypeHistoryDayAmount: ExerciseTypeHistoryDayAmountModel;
  Float: Scalars['Float']['output'];
  FogisGame: FogisGameModel;
  HeartRateSummary: HeartRateSummaryModel;
  ID: Scalars['ID']['output'];
  Int: Scalars['Int']['output'];
  PageInfo: PageInfo;
  PhysicalTest: PhysicalTestModel;
  PlannedExercise: PlannedExerciseModel;
  Query: {};
  String: Scalars['String']['output'];
  User: UserModel;
};

export type ActivityResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Activity'] = ResolversParentTypes['Activity']> = {
  __resolveType: TypeResolveFn<'CustomGame' | 'Exercise' | 'FogisGame' | 'PhysicalTest' | 'PlannedExercise', ParentType, ContextType>;
};

export type ActivityBaseResolvers<ContextType = Context, ParentType extends ResolversParentTypes['ActivityBase'] = ResolversParentTypes['ActivityBase']> = {
  __resolveType: TypeResolveFn<'CustomGame' | 'Exercise' | 'FogisGame' | 'PhysicalTest' | 'PlannedExercise', ParentType, ContextType>;
  id: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  start: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  title: Resolver<ResolversTypes['String'], ParentType, ContextType>;
};

export type ActivityConnectionResolvers<ContextType = Context, ParentType extends ResolversParentTypes['ActivityConnection'] = ResolversParentTypes['ActivityConnection']> = {
  edges: Resolver<Array<ResolversTypes['ActivityEdge']>, ParentType, ContextType>;
  pageInfo: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ActivityEdgeResolvers<ContextType = Context, ParentType extends ResolversParentTypes['ActivityEdge'] = ResolversParentTypes['ActivityEdge']> = {
  cursor: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  node: Resolver<Maybe<ResolversTypes['Activity']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CustomGameResolvers<ContextType = Context, ParentType extends ResolversParentTypes['CustomGame'] = ResolversParentTypes['CustomGame']> = {
  id: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  start: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  title: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export interface DateTimeScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['DateTime'], any> {
  name: 'DateTime';
}

export type DayResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Day'] = ResolversParentTypes['Day']> = {
  activities: Resolver<ResolversTypes['ActivityConnection'], ParentType, ContextType, Partial<DayActivitiesArgs>>;
  date: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  heartRateSummary: Resolver<Maybe<ResolversTypes['HeartRateSummary']>, ParentType, ContextType>;
  start: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type DayConnectionResolvers<ContextType = Context, ParentType extends ResolversParentTypes['DayConnection'] = ResolversParentTypes['DayConnection']> = {
  edges: Resolver<Array<ResolversTypes['DayEdge']>, ParentType, ContextType>;
  pageInfo: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type DayEdgeResolvers<ContextType = Context, ParentType extends ResolversParentTypes['DayEdge'] = ResolversParentTypes['DayEdge']> = {
  cursor: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  node: Resolver<Maybe<ResolversTypes['Day']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ExerciseResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Exercise'] = ResolversParentTypes['Exercise']> = {
  comment: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  description: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  isHiddenFromOverview: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  items: Resolver<ResolversTypes['ExerciseItemConnection'], ParentType, ContextType>;
  primaryPurpose: Resolver<Maybe<ResolversTypes['ExercisePurpose']>, ParentType, ContextType>;
  secondaryPurpose: Resolver<Maybe<ResolversTypes['ExercisePurpose']>, ParentType, ContextType>;
  start: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  title: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ExerciseAmountResolvers<ContextType = Context, ParentType extends ResolversParentTypes['ExerciseAmount'] = ResolversParentTypes['ExerciseAmount']> = {
  duration: Resolver<ResolversTypes['ExerciseDuration'], ParentType, ContextType>;
  loads: Resolver<Array<ResolversTypes['ExerciseLoad']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ExerciseDurationResolvers<ContextType = Context, ParentType extends ResolversParentTypes['ExerciseDuration'] = ResolversParentTypes['ExerciseDuration']> = {
  __resolveType: TypeResolveFn<'ExerciseDurationRepetitions' | 'ExerciseDurationTime', ParentType, ContextType>;
};

export type ExerciseDurationRepetitionsResolvers<ContextType = Context, ParentType extends ResolversParentTypes['ExerciseDurationRepetitions'] = ResolversParentTypes['ExerciseDurationRepetitions']> = {
  repetitions: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ExerciseDurationTimeResolvers<ContextType = Context, ParentType extends ResolversParentTypes['ExerciseDurationTime'] = ResolversParentTypes['ExerciseDurationTime']> = {
  durationSeconds: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ExerciseItemResolvers<ContextType = Context, ParentType extends ResolversParentTypes['ExerciseItem'] = ResolversParentTypes['ExerciseItem']> = {
  amount: Resolver<Array<ResolversTypes['ExerciseAmount']>, ParentType, ContextType>;
  exercise: Resolver<ResolversTypes['Exercise'], ParentType, ContextType>;
  exerciseType: Resolver<ResolversTypes['ExerciseType'], ParentType, ContextType>;
  id: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ExerciseItemConnectionResolvers<ContextType = Context, ParentType extends ResolversParentTypes['ExerciseItemConnection'] = ResolversParentTypes['ExerciseItemConnection']> = {
  edges: Resolver<Array<ResolversTypes['ExerciseItemEdge']>, ParentType, ContextType>;
  pageInfo: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ExerciseItemEdgeResolvers<ContextType = Context, ParentType extends ResolversParentTypes['ExerciseItemEdge'] = ResolversParentTypes['ExerciseItemEdge']> = {
  cursor: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  node: Resolver<Maybe<ResolversTypes['ExerciseItem']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ExerciseLoadResolvers<ContextType = Context, ParentType extends ResolversParentTypes['ExerciseLoad'] = ResolversParentTypes['ExerciseLoad']> = {
  type: Resolver<ResolversTypes['ExerciseLoadType'], ParentType, ContextType>;
  unit: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  value: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ExerciseLoadTypeResolvers<ContextType = Context, ParentType extends ResolversParentTypes['ExerciseLoadType'] = ResolversParentTypes['ExerciseLoadType']> = {
  id: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  name: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  unit: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ExercisePurposeResolvers<ContextType = Context, ParentType extends ResolversParentTypes['ExercisePurpose'] = ResolversParentTypes['ExercisePurpose']> = {
  label: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  shortLabel: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ExerciseTypeResolvers<ContextType = Context, ParentType extends ResolversParentTypes['ExerciseType'] = ResolversParentTypes['ExerciseType']> = {
  defaultAmountType: Resolver<ResolversTypes['AmountType'], ParentType, ContextType>;
  history: Resolver<ResolversTypes['ExerciseTypeHistory'], ParentType, ContextType>;
  id: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  loadTypes: Resolver<Array<ResolversTypes['ExerciseLoadType']>, ParentType, ContextType>;
  name: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ExerciseTypeConnectionResolvers<ContextType = Context, ParentType extends ResolversParentTypes['ExerciseTypeConnection'] = ResolversParentTypes['ExerciseTypeConnection']> = {
  edges: Resolver<Array<ResolversTypes['ExerciseTypeEdge']>, ParentType, ContextType>;
  pageInfo: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ExerciseTypeEdgeResolvers<ContextType = Context, ParentType extends ResolversParentTypes['ExerciseTypeEdge'] = ResolversParentTypes['ExerciseTypeEdge']> = {
  cursor: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  node: Resolver<Maybe<ResolversTypes['ExerciseType']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ExerciseTypeHistoryResolvers<ContextType = Context, ParentType extends ResolversParentTypes['ExerciseTypeHistory'] = ResolversParentTypes['ExerciseTypeHistory']> = {
  dayAmounts: Resolver<Array<ResolversTypes['ExerciseTypeHistoryDayAmount']>, ParentType, ContextType>;
  name: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ExerciseTypeHistoryDayAmountResolvers<ContextType = Context, ParentType extends ResolversParentTypes['ExerciseTypeHistoryDayAmount'] = ResolversParentTypes['ExerciseTypeHistoryDayAmount']> = {
  dayAmounts: Resolver<Array<ResolversTypes['ExerciseAmount']>, ParentType, ContextType>;
  dayStart: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type FogisGameResolvers<ContextType = Context, ParentType extends ResolversParentTypes['FogisGame'] = ResolversParentTypes['FogisGame']> = {
  awayTeam: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  homeTeam: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  start: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  title: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type HeartRateSummaryResolvers<ContextType = Context, ParentType extends ResolversParentTypes['HeartRateSummary'] = ResolversParentTypes['HeartRateSummary']> = {
  secondsInZone: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType, Partial<HeartRateSummarySecondsInZoneArgs>>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type PageInfoResolvers<ContextType = Context, ParentType extends ResolversParentTypes['PageInfo'] = ResolversParentTypes['PageInfo']> = {
  endCursor: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  hasNextPage: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  hasPreviousPage: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  startCursor: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type PhysicalTestResolvers<ContextType = Context, ParentType extends ResolversParentTypes['PhysicalTest'] = ResolversParentTypes['PhysicalTest']> = {
  id: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  start: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  title: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type PlannedExerciseResolvers<ContextType = Context, ParentType extends ResolversParentTypes['PlannedExercise'] = ResolversParentTypes['PlannedExercise']> = {
  comment: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  description: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  primaryPurpose: Resolver<Maybe<ResolversTypes['ExercisePurpose']>, ParentType, ContextType>;
  secondaryPurpose: Resolver<Maybe<ResolversTypes['ExercisePurpose']>, ParentType, ContextType>;
  start: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  title: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type QueryResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  activities: Resolver<ResolversTypes['ActivityConnection'], ParentType, ContextType, Partial<QueryActivitiesArgs>>;
  activity: Resolver<Maybe<ResolversTypes['Activity']>, ParentType, ContextType, RequireFields<QueryActivityArgs, 'id'>>;
  day: Resolver<Maybe<ResolversTypes['Day']>, ParentType, ContextType, RequireFields<QueryDayArgs, 'date'>>;
  days: Resolver<ResolversTypes['DayConnection'], ParentType, ContextType, Partial<QueryDaysArgs>>;
  exercise: Resolver<Maybe<ResolversTypes['Exercise']>, ParentType, ContextType, RequireFields<QueryExerciseArgs, 'id'>>;
  exerciseType: Resolver<Maybe<ResolversTypes['ExerciseType']>, ParentType, ContextType, RequireFields<QueryExerciseTypeArgs, 'id'>>;
  exerciseTypes: Resolver<ResolversTypes['ExerciseTypeConnection'], ParentType, ContextType>;
  me: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  today: Resolver<ResolversTypes['Day'], ParentType, ContextType>;
};

export type UserResolvers<ContextType = Context, ParentType extends ResolversParentTypes['User'] = ResolversParentTypes['User']> = {
  email: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type Resolvers<ContextType = Context> = {
  Activity: ActivityResolvers<ContextType>;
  ActivityBase: ActivityBaseResolvers<ContextType>;
  ActivityConnection: ActivityConnectionResolvers<ContextType>;
  ActivityEdge: ActivityEdgeResolvers<ContextType>;
  CustomGame: CustomGameResolvers<ContextType>;
  DateTime: GraphQLScalarType;
  Day: DayResolvers<ContextType>;
  DayConnection: DayConnectionResolvers<ContextType>;
  DayEdge: DayEdgeResolvers<ContextType>;
  Exercise: ExerciseResolvers<ContextType>;
  ExerciseAmount: ExerciseAmountResolvers<ContextType>;
  ExerciseDuration: ExerciseDurationResolvers<ContextType>;
  ExerciseDurationRepetitions: ExerciseDurationRepetitionsResolvers<ContextType>;
  ExerciseDurationTime: ExerciseDurationTimeResolvers<ContextType>;
  ExerciseItem: ExerciseItemResolvers<ContextType>;
  ExerciseItemConnection: ExerciseItemConnectionResolvers<ContextType>;
  ExerciseItemEdge: ExerciseItemEdgeResolvers<ContextType>;
  ExerciseLoad: ExerciseLoadResolvers<ContextType>;
  ExerciseLoadType: ExerciseLoadTypeResolvers<ContextType>;
  ExercisePurpose: ExercisePurposeResolvers<ContextType>;
  ExerciseType: ExerciseTypeResolvers<ContextType>;
  ExerciseTypeConnection: ExerciseTypeConnectionResolvers<ContextType>;
  ExerciseTypeEdge: ExerciseTypeEdgeResolvers<ContextType>;
  ExerciseTypeHistory: ExerciseTypeHistoryResolvers<ContextType>;
  ExerciseTypeHistoryDayAmount: ExerciseTypeHistoryDayAmountResolvers<ContextType>;
  FogisGame: FogisGameResolvers<ContextType>;
  HeartRateSummary: HeartRateSummaryResolvers<ContextType>;
  PageInfo: PageInfoResolvers<ContextType>;
  PhysicalTest: PhysicalTestResolvers<ContextType>;
  PlannedExercise: PlannedExerciseResolvers<ContextType>;
  Query: QueryResolvers<ContextType>;
  User: UserResolvers<ContextType>;
};

