import { GraphQLScalarType } from "graphql";
import { DateTime } from "luxon";

export const dateTimeScalar = new GraphQLScalarType({
  name: "DateTime",
  serialize: (value) => (value as DateTime).toISO(),
  parseValue: (value) => DateTime.fromISO(value as string),
});
