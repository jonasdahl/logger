import type { TypedDocumentNode } from "@graphql-typed-document-node/core";
import type { ExecutionResult } from "graphql";
import { graphql as graphqlQuery, print } from "graphql";
import type { ObjMap } from "graphql/jsutils/ObjMap";
import { authenticator } from "~/auth.server";
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
