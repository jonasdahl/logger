import { Box, Container, Heading, Stack } from "@chakra-ui/react";
import { authenticator } from "~/auth.server";
import { HiddenReturnToInput } from "~/services/return-to";

import { LoaderFunctionArgs, json } from "@remix-run/node";
import { useLoaderData, useParams } from "@remix-run/react";
import { z } from "zod";
import { ButtonLink } from "~/components/button-link";
import { ExerciseDetailsDocument } from "~/graphql/generated/documents";
import { gql } from "~/graphql/graphql.server";

export async function loader({ request, params }: LoaderFunctionArgs) {
  const { id: userId } = await authenticator.isAuthenticated(request, {
    failureRedirect: "/",
  });
  const { exerciseId } = await z
    .object({ exerciseId: z.string() })
    .parse(params);

  const res = await gql({
    document: ExerciseDetailsDocument,
    request,
    variables: { exerciseId },
  });

  return json(res.data);
}

export default function Activity() {
  const { exerciseId } = useParams();
  const data = useLoaderData<typeof loader>();

  return (
    <Container py={5}>
      <HiddenReturnToInput />
      <Stack spacing={5}>
        <Heading as="h1">Träning</Heading>
        <Heading size="md" as="h2">
          Övningar
        </Heading>
        {data?.exercise?.items.edges.map((edge) => {
          return <Box key={edge.cursor}>{edge.node?.exerciseType.name}</Box>;
        })}
        <ButtonLink to={`/exercises/${exerciseId}/items/create`}>
          Lägg till
        </ButtonLink>
      </Stack>
    </Container>
  );
}
