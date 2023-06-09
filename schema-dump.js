const { printSchema } = require("graphql");

module.exports = {
  plugin(schema, documents, config) {
    return `export const typeDefinitions = \`${printSchema(schema)}\``;
  },
};
