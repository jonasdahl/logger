/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
import { DateTime, Interval } from "luxon";
import { matchSorter } from "match-sorter";
import { sortBy } from "remeda";
import { db } from "~/db.server";
import type { QueryResolvers } from "~/graphql/generated/graphql";

export const queryResolvers: QueryResolvers = {
  timeZone: (_, __, { timeZone }) => timeZone,
  me: async (_, __, { userId }) => {
    if (!userId) {
      return null;
    }
    const user = await db.user.findUniqueOrThrow({ where: { id: userId } });
    return user;
  },

  currentActivity: async (_, __, { userId, timeZone }) => {
    if (!userId) {
      return null;
    }
    const dayStart = DateTime.now().setZone(timeZone).startOf("day");
    const dayEnd = dayStart.endOf("day");
    // TODO More activities
    const activity = await db.activity.findFirst({
      where: {
        userId,
        deletedAt: null,
        time: {
          lte: dayEnd.toJSDate(),
          gte: dayStart.toJSDate(),
        },
        endedAt: null,
      },
      orderBy: { time: "desc" },
    });
    if (!activity) {
      return null;
    }
    return { type: "Exercise", value: activity };
  },
  lastActivity: async (_, __, { userId, timeZone }) => {
    if (!userId) {
      return null;
    }
    // TODO More activities
    const activity = await db.activity.findFirst({
      where: { userId, deletedAt: null },
      orderBy: { time: "desc" },
    });
    if (!activity) {
      return null;
    }
    return { type: "Exercise", value: activity };
  },
  activity: async (_, { id }, { userId }) => {
    if (!userId) {
      return null;
    }
    // TODO More activities
    const activity = await db.activity.findUnique({
      where: { id: id as string, userId },
    });
    if (!activity) {
      return null;
    }
    return { type: "Exercise", value: activity };
  },
  exercise: async (_, { id }, { userId }) => {
    if (!userId) {
      return null;
    }
    const exercise = await db.activity.findUnique({
      where: { id: id as string, userId },
    });
    if (!exercise) {
      return null;
    }
    return { type: "Exercise", value: exercise };
  },
  exerciseTypes: async (_, { filter }, { userId }) => {
    if (!userId) {
      return {
        edges: [],
        pageInfo: {
          startCursor: null,
          endCursor: null,
          hasNextPage: false,
          hasPreviousPage: false,
        },
      };
    }
    const nodes = await db.exerciseType.findMany({
      where: { OR: [{ userId }, { userId: null }], deletedAt: null },
      orderBy: { name: "asc" },
    });
    const filtered: typeof nodes = filter?.search
      ? matchSorter(nodes, filter.search, { keys: [(x) => x.name] })
      : nodes;
    return {
      edges: filtered.map((node) => ({ cursor: node.id, node })),
      pageInfo: {
        startCursor: nodes[0]?.id!,
        endCursor: nodes[nodes.length - 1]?.id!,
        hasNextPage: false,
        hasPreviousPage: false,
      },
    };
  },
  exerciseType: async (_, { id }, { userId }) => {
    if (!userId) {
      return null;
    }
    return db.exerciseType.findFirstOrThrow({
      where: {
        OR: [{ userId }, { userId: null }],
        deletedAt: null,
        id: id as string,
      },
    });
  },

  day: async (_, { date }) => {
    const parsed = DateTime.fromFormat(date, "yyyy-MM-dd", {
      zone: "Europe/Stockholm", // TODO
    });
    if (!parsed.isValid) {
      throw new Error("Invalid date");
    }
    return { start: parsed };
  },
  activities: async (_, { filter }, { userId }) => {
    if (!userId) {
      throw new Error("Not authenticated");
    }
    const customGames = await db.customGame.findMany({
      where: {
        userId,
        time: {
          gte: filter?.startFrom?.toJSDate() ?? undefined,
          lte: filter?.startTo?.toJSDate() ?? undefined,
        },
        deletedAt: null,
      },
    });
    const fogisGames = await db.fogisGame.findMany({
      where: {
        userId,
        time: {
          gte: filter?.startFrom?.toJSDate() ?? undefined,
          lte: filter?.startTo?.toJSDate() ?? undefined,
        },
        deletedAt: null,
      },
    });
    const activities = await db.activity.findMany({
      where: {
        userId,
        time: {
          gte: filter?.startFrom?.toJSDate() ?? undefined,
          lte: filter?.startTo?.toJSDate() ?? undefined,
        },
        deletedAt: null,
      },
    });
    const plannedActivities = await db.plannedActivity.findMany({
      where: {
        userId,
        time: {
          gte: filter?.startFrom?.toJSDate() ?? undefined,
          lte: filter?.startTo?.toJSDate() ?? undefined,
        },
        deletedAt: null,
      },
    });
    const physicalTests = await db.physicalTest.findMany({
      where: {
        userId,
        time: {
          gte: filter?.startFrom?.toJSDate() ?? undefined,
          lte: filter?.startTo?.toJSDate() ?? undefined,
        },
      },
    });
    const travel = await db.travel.findMany({
      where: {
        userId,
        start: { lte: filter?.startTo?.toJSDate() ?? undefined },
        end: { gte: filter?.startFrom?.toJSDate() ?? undefined },
      },
    });
    return {
      pageInfo: {
        endCursor: null,
        hasNextPage: false,
        hasPreviousPage: false,
        startCursor: null,
      },
      edges: sortBy(
        [
          ...customGames.map((customGame) => ({
            cursor: customGame.id,
            node: { type: "CustomGame" as const, value: customGame },
          })),
          ...fogisGames.map((fogisGame) => ({
            cursor: fogisGame.id,
            node: { type: "FogisGame" as const, value: fogisGame },
          })),
          ...activities.map((activity) => ({
            cursor: activity.id,
            node: { type: "Exercise" as const, value: activity },
          })),
          ...plannedActivities.map((activity) => ({
            cursor: activity.id,
            node: { type: "PlannedExercise" as const, value: activity },
          })),
          ...physicalTests.map((activity) => ({
            cursor: activity.id,
            node: { type: "PhysicalTest" as const, value: activity },
          })),
          ...travel.map((travel) => ({
            cursor: travel.id,
            node: { type: "Travel" as const, value: travel },
          })),
        ],
        [
          (x) =>
            x.node.type === "Travel" ? x.node.value.start : x.node.value.time,
          "asc",
        ]
      ),
    };
  },
  days: (_, { after, before }, { timeZone }) => {
    if (!after) {
      throw new Error('Missing "after" argument');
    }
    if (!before) {
      throw new Error('Missing "before" argument');
    }
    const start = DateTime.fromFormat(after, "yyyy-MM-dd", { zone: timeZone })
      .startOf("day")
      .plus({ days: 1 });
    const end = DateTime.fromFormat(before, "yyyy-MM-dd", { zone: timeZone })
      .endOf("day")
      .minus({ days: 1 });
    const interval = Interval.fromDateTimes(start, end);
    const days = interval
      .splitBy({ days: 1 })
      .map((interval) => ({ start: interval.start! }));
    return {
      pageInfo: {
        hasNextPage: true,
        hasPreviousPage: true,
        endCursor: days[days.length - 1]?.start!.toFormat("yyyy-MM-dd")!,
        startCursor: days[0]?.start!.toFormat("yyyy-MM-dd")!,
      },
      edges: days.map((day) => ({
        cursor: day.start!.toFormat("yyyy-MM-dd"),
        node: day,
      })),
    };
  },
  today: (_, __, { timeZone }) => ({
    start: DateTime.now()!.setZone(timeZone)!,
  }),
  game: async (_, { id }, { userId }) => {
    if (!userId) {
      throw new Error("Not authenticated");
    }
    const fogisGame = await db.fogisGame.findFirst({
      where: { id, deletedAt: null, userId },
    });
    if (fogisGame) {
      return { type: "FogisGame", value: fogisGame };
    }
    const customGame = await db.customGame.findFirstOrThrow({
      where: { id, deletedAt: null, userId },
    });
    return { type: "CustomGame", value: customGame };
  },
  categoryTags: (_, __, { userId }) => {
    if (!userId) {
      throw new Error("Not authenticated");
    }
    return db.categoryTag.findMany({ where: { userId } });
  },
  goals: async (_, __, { userId }) => {
    if (!userId) {
      throw new Error("Not authenticated");
    }
    return db.goal.findMany({ where: { userId } });
  },
  goal: async (_, { id }, { userId }) => {
    if (!userId) {
      throw new Error("Not authenticated");
    }
    return db.goal.findFirstOrThrow({ where: { id, userId } });
  },
  upcomingPlannedExercise: async (_, __, { userId, timeZone }) => {
    if (!userId) {
      return null;
    }
    const today = DateTime.now().setZone(timeZone).startOf("day");
    const plannedActivity = await db.plannedActivity.findFirst({
      where: {
        userId,
        time: { gte: today.toJSDate() },
        deletedAt: null,
        generatedActivities: { none: { deletedAt: null } },
      },
      orderBy: { time: "asc" },
    });
    if (!plannedActivity) {
      return null;
    }
    return { type: "PlannedExercise", value: plannedActivity };
  },
  plannedExercise: async (_, { id }, { userId }) => {
    if (!userId) {
      return null;
    }
    return {
      type: "PlannedExercise",
      value: await db.plannedActivity.findFirstOrThrow({
        where: { id, userId },
      }),
    };
  },
};
