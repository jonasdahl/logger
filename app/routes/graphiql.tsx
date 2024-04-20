import type { LinksFunction } from "@remix-run/node";
import GraphiQL from "graphiql";
import css from "graphiql/graphiql.min.css?url";
import { ClientOnly } from "~/components/client-only";

export const links: LinksFunction = () => [
  { rel: "stylesheet", type: "text/css", href: css },
];

export default function Playground() {
  return (
    <ClientOnly>
      {() => (
        <GraphiQL
          fetcher={async (graphQLParams): Promise<any> => {
            const data = await fetch("/graphql", {
              method: "POST",
              headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
              },
              body: JSON.stringify(graphQLParams),
            });
            const res = await data.text();
            try {
              return JSON.parse(res);
            } catch {
              return res;
            }
          }}
        />
      )}
    </ClientOnly>
  );
}
