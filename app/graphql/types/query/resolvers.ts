import { orderBy } from "lodash";
import { DateTime, Interval } from "luxon";
import { db } from "~/db.server";
import type { QueryResolvers } from "~/graphql/generated/graphql";

export const queryResolvers: QueryResolvers = {
  me: async (_, __, { userId }) => {
    if (!userId) {
      return null;
    }
    const user = await db.user.findUniqueOrThrow({ where: { id: userId } });
    return user;
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
  exerciseTypes: async (_, __, { userId }) => {
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
    });
    return {
      edges: nodes.map((node) => ({ cursor: node.id, node })),
      pageInfo: {
        startCursor: nodes[0]?.id,
        endCursor: nodes[nodes.length - 1]?.id,
        hasNextPage: false,
        hasPreviousPage: false,
      },
    };
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
    return {
      pageInfo: {
        endCursor: null,
        hasNextPage: false,
        hasPreviousPage: false,
        startCursor: null,
      },
      edges: orderBy(
        [
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
        ],
        (x) => x.node.value.time,
        "asc"
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
        endCursor: days[days.length - 1].start!.toFormat("yyyy-MM-dd"),
        startCursor: days[0].start!.toFormat("yyyy-MM-dd"),
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
};
