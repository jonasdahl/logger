import type { UserResolvers } from "~/graphql/generated/graphql";

export const userResolvers: UserResolvers = {
  id: (parent) => parent.id,
  email: (parent) => parent.email,
  maxPulse: (parent) => parent.maxPulse,
};
