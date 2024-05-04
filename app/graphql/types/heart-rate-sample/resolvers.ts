import { type HeartRateSampleResolvers } from "~/graphql/generated/graphql";

export const heartRateSampleResolvers: HeartRateSampleResolvers = {
  heartRate: (parent) => parent.heartRate,
  time: (parent) => parent.time,
};
