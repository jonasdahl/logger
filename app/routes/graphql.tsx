import type { ActionArgs } from "@remix-run/node";
import { parse } from "graphql";
import { gql } from "~/graphql/graphql.server";

export async function action({ request }: ActionArgs) {
  const params = (await request.json()) as any;
  const result = await gql({
    document: parse(params.query),
    variables: params.variables ?? {},
    request,
  });
  return new Response(JSON.stringify(result), {
    headers: { "Content-Type": "application/json" },
    status: 200,
  });
}
