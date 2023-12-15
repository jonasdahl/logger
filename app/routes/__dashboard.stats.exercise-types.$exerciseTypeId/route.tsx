import { Container, Heading, Stack } from "@chakra-ui/react";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { authenticator } from "~/auth.server";
import { StatsExerciseTypeDocument } from "~/graphql/generated/documents";
import { gql } from "~/graphql/graphql.server";

export async function loader({ request, params }: LoaderFunctionArgs) {
  await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  });

  const res = await gql({
    document: StatsExerciseTypeDocument,
    request,
    variables: { exerciseTypeId: params.exerciseTypeId! },
  });

  return json(res);
}

export default function ExerciseTypeStats() {
  const { data } = useLoaderData<typeof loader>();

  return (
    <Container py={5} maxW="container.md">
      <Stack spacing={5}>
        <Heading>{data?.exerciseType?.name}</Heading>
      </Stack>
    </Container>
  );
}
