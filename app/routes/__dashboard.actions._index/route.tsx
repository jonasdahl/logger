import { Button, Container, Stack } from "@chakra-ui/react";

import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { authenticator } from "~/.server/auth.server";
import { ActionsDocument } from "~/graphql/generated/documents";
import { gql } from "~/graphql/graphql.server";

export async function loader({ request }: LoaderFunctionArgs) {
  await authenticator.isAuthenticated(request, { failureRedirect: "/login" });
  const { data } = await gql({
    document: ActionsDocument,
    request,
    variables: {},
  });
  return json({ currentActivity: data?.currentActivity, today: data?.today });
}

export default function Actions() {
  const { currentActivity, today } = useLoaderData<typeof loader>();

  return (
    <Container py={5} mt="auto">
      <Stack>
        {currentActivity?.__typename === "Exercise" ? (
          <Button
            as={Link}
            colorScheme="green"
            size="lg"
            w="100%"
            to={`/exercises/${currentActivity.id}`}
          >
            Gå till träningspass
          </Button>
        ) : (
          <Button as={Link} to="/exercises/live" w="100%">
            Starta träningspass
          </Button>
        )}

        {today?.activities?.edges
          ?.flatMap(({ node }) =>
            node?.__typename === "CustomGame" ||
            node?.__typename === "FogisGame"
              ? [node]
              : []
          )
          .map((node) => {
            return (
              <Button
                key={node.id}
                as={Link}
                colorScheme="red"
                size="lg"
                w="100%"
                to={`/games/${node.id}`}
              >
                {node.title}
              </Button>
            );
          })}
      </Stack>
    </Container>
  );
}
