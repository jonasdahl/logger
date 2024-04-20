import { printSchema } from "graphql";

export function plugin(schema, documents, config) {
  return `export const typeDefinitions = \`${printSchema(schema)}\``;
}
