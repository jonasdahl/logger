import type { EventResolvers } from "~/graphql/generated/graphql";

export const eventResolvers: EventResolvers = {
  time: (parent) => parent.time,
  description: (parent) => parent.description,
};
