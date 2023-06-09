import type { Resolvers } from "./generated/graphql";
import { queryResolvers } from "./types/query/resolvers";
import { userResolvers } from "./types/user/resolvers";

export const resolvers: Resolvers = {
  Query: queryResolvers,
  User: userResolvers,
};
