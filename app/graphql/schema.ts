import { makeExecutableSchema } from "@graphql-tools/schema";
import { typeDefinitions } from "./generated/graphql-schema";
import { resolvers } from "./resolvers";

export const schema = makeExecutableSchema({
  resolvers: [resolvers],
  typeDefs: [typeDefinitions],
});
