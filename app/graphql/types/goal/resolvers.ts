import type { GoalResolvers } from "~/graphql/generated/graphql";
import { goalBaseResolvers } from "../goal-base/resolvers";

export const goalResolvers: GoalResolvers = {
  __resolveType: goalBaseResolvers.__resolveType,
};
