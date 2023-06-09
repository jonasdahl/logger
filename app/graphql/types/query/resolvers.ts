import { orderBy } from "lodash";
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
  activities: async (_, __, { userId }) => {
    if (!userId) {
      throw new Error("Not authenticated");
    }
    const fogisGames = await db.fogisGame.findMany({ where: { userId } });
    const activities = await db.activity.findMany({ where: { userId } });
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
