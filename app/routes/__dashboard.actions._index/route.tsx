import { Button, Stack } from "@chakra-ui/react";

import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { authenticator } from "~/.server/auth.server";
import { ButtonLink } from "~/components/button-link";
import { Container } from "~/components/ui/container";
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
    <Container>
      <Stack>
        {currentActivity?.__typename === "Exercise" ? (
          <ButtonLink size="lg" to={`/exercises/${currentActivity.id}`}>
            Gå till träningspass
          </ButtonLink>
        ) : (
          <ButtonLink to="/exercises/live" variant="secondary">
            Starta träningspass
          </ButtonLink>
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
