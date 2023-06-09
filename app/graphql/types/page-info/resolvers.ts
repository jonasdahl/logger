import type { PageInfoResolvers } from "~/graphql/generated/graphql";

export const pageInfoResolvers: PageInfoResolvers = {
  endCursor: (pageInfo) => pageInfo.endCursor,
  hasNextPage: (pageInfo) => pageInfo.hasNextPage,
  hasPreviousPage: (pageInfo) => pageInfo.hasPreviousPage,
  startCursor: (pageInfo) => pageInfo.startCursor,
};
