import { orderBy } from "lodash";
import { db } from "~/db.server";
import type { DayResolvers } from "~/graphql/generated/graphql";

export const dayResolvers: DayResolvers = {
  start: (parent) => parent.start,
  date: (parent) => parent.start.toFormat("yyyy-MM-dd"),
  activities: async (parent, { includeHidden = true }, { userId }) => {
    const start = parent.start.startOf("day");
    const end = parent.start.endOf("day");

    if (!userId) {
      throw new Error("Not authenticated");
    }
    const fogisGames = await db.fogisGame.findMany({
      where: {
        userId,
        time: { gte: start.toJSDate(), lte: end.toJSDate() },
        deletedAt: null,
      },
    });
    const activities = await db.activity.findMany({
      where: {
        userId,
        time: { gte: start.toJSDate(), lte: end.toJSDate() },
        deletedAt: null,
        isHiddenFromOverview: includeHidden ? undefined : false,
      },
    });
    const plannedActivities = await db.plannedActivity.findMany({
      where: {
        userId,
        time: { gte: start.toJSDate(), lte: end.toJSDate() },
        deletedAt: null,
      },
    });
    const physicalTests = await db.physicalTest.findMany({
      where: {
        userId,
        time: { gte: start.toJSDate(), lte: end.toJSDate() },
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
          ...physicalTests.map((physicalTest) => ({
            cursor: physicalTest.id,
            node: { type: "PhysicalTest" as const, value: physicalTest },
          })),
        ],
        (x) => x.node.value.time,
        "asc"
      ),
    };
  },
};
