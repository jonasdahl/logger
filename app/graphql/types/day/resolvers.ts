import { orderBy } from "lodash";
import { db } from "~/db.server";
import type { DayResolvers } from "~/graphql/generated/graphql";

export const dayResolvers: DayResolvers = {
  start: (parent) => parent.start,
  activities: async (parent, _, { userId }) => {
    const start = parent.start.startOf("day");
    const end = parent.start.endOf("day");

    if (!userId) {
      throw new Error("Not authenticated");
    }
    const fogisGames = await db.fogisGame.findMany({
      where: {
        userId,
        time: { gte: start.toJSDate(), lte: end.toJSDate() },
      },
    });
    const activities = await db.activity.findMany({
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
        ],
        (x) => x.node.value.time,
        "asc"
      ),
    };
  },
};
