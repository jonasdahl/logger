import { type CategoryTagResolvers } from "~/graphql/generated/graphql";

export const categoryTagResolvers: CategoryTagResolvers = {
  id: (parent) => parent.id,
  name: (parent) => parent.name,
};
