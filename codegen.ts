import type { CodegenConfig } from "@graphql-codegen/cli";
import fg from "fast-glob";

const mapperPaths = fg.sync(["app/graphql/types/**/model.ts"]);
const mapperList = mapperPaths
  .map((mapperPath) => parseMapperPath(mapperPath))
  .filter(function <T>(x: T | null): x is T {
    return x !== null;
  });

function parseMapperPath(path: string) {
  const parts = path.match(/^.*\/(.+)\/model\.ts$/);
  if (!parts) {
    return null;
  }
  const name = parts[1];
  if (!name) {
    return null;
  }
  const pascalName = kebabCaseToPascalCase(name);
  return {
    type: pascalName,
    model: `${pascalName}Model`,
    path: path.replace("app/graphql/types", "../types").replace(/\.ts$/, ""),
  };
}
const mappers = mapperList.reduce((result, mapper) => {
  result[mapper.type] = `${mapper.path}#${mapper.model}`;
  return result;
}, {} as Record<string, string>);

function kebabCaseToPascalCase(x: string) {
  return x
    .replace(/(^[a-z])|(-[a-z])/g, (match) => match.toUpperCase())
    .replace(/-/g, "");
}

const config: CodegenConfig = {
  overwrite: true,
  schema: ["app/graphql/**/*.graphql"],
  documents: ["app/routes/**/*.graphql"],
  generates: {
    "app/graphql/generated/graphql.ts": {
      plugins: ["typescript", "typescript-resolvers"],
      config: {
        avoidOptionals: true,
        contextType: "../context#Context",
        strictScalars: true,
        scalars: { DateTime: "luxon#DateTime" },
        mappers,
      },
    },
    "./graphql.schema.json": {
      plugins: ["introspection"],
    },
    "app/graphql/generated/graphql-schema.ts": {
      plugins: ["./schema-dump.js"],
    },
    "app/graphql/generated/documents.ts": {
      plugins: ["typescript", "typescript-operations", "typed-document-node"],
      config: {
        avoidOptionals: true,
        immutableTypes: true,
        strictScalars: true,
        scalars: { DateTime: "string" },
      },
    },
  },
};

export default config;
