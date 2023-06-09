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
};
