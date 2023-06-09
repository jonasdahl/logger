import type { TypedDocumentNode } from "@graphql-typed-document-node/core";
import { graphql as graphqlQuery, print } from "graphql";
import { authenticator } from "~/auth.server";
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
  const contextValue: Context = { userId: session?.id ?? null };
  return graphqlQuery({
    schema: schema,
    source: print(document),
    contextValue,
    variableValues: variables,
  });
}
