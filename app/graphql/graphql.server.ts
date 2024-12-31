import type { TypedDocumentNode } from "@graphql-typed-document-node/core";
import type { ExecutionResult } from "graphql";
import { graphql as graphqlQuery, print } from "graphql";
import type { ObjMap } from "graphql/jsutils/ObjMap";
import { authenticator } from "~/.server/auth.server";
import { getTimeZoneFromRequest } from "~/time";
import type { Context } from "./context";
import { schema } from "./schema";

export async function gql<TResult, TVariables extends {}>({
  document,
  variables,
  request,
}: {
  document: TypedDocumentNode<TResult, TVariables>;
  variables: TVariables;
  request: Request;
}) {
  const session = await authenticator.isAuthenticated(request);
  const contextValue: Context = {
    userId: session?.id ?? null,
    timeZone: await getTimeZoneFromRequest(request),
  };
  const res = await graphqlQuery({
    schema: schema,
    source: print(document),
    contextValue,
    variableValues: variables,
  });

  return res as ExecutionResult<TResult, ObjMap<unknown>>;
}

export async function gqlData<
  TResult,
  TVariables extends {},
  TRequiredKeys extends (keyof TResult)[] = []
>({
  document,
  variables,
  request,
  requiredProperties,
}: {
  document: TypedDocumentNode<TResult, TVariables>;
  variables: TVariables;
  request: Request;
  requiredProperties?: TRequiredKeys;
}) {
  const res = await gql({ document, request, variables });
  const data = res.data;
  if (!data || res.errors) {
    console.error(res.errors);
    throw new Error("GraphQL query failed");
  }
  const invalidProperty = requiredProperties?.find(
    (propertyKey) => !data[propertyKey]
  );
  if (invalidProperty) {
    throw new Error(
      `Required property not found in query: ${invalidProperty.toString()}`
    );
  }
  return data as TResult & {
    [key in TRequiredKeys[number]]: NonNullable<TResult[key]>;
  };
}
