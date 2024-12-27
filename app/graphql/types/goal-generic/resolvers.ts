import type { GoalGenericResolvers } from "~/graphql/generated/graphql";
import { goalBaseResolvers } from "../goal-base/resolvers";

export const goalGenericResolvers: GoalGenericResolvers = {
  id: goalBaseResolvers.id,
  title: goalBaseResolvers.title,
  currentProgress: () => 0,
};
