import { Box, Container, Heading, Stack } from "@chakra-ui/react";
import { authenticator } from "~/auth.server";
import { HiddenReturnToInput } from "~/services/return-to";

import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  json,
  redirect,
} from "@remix-run/node";
import { useLoaderData, useParams } from "@remix-run/react";
import { withZod } from "@remix-validated-form/with-zod";
import { ValidatedForm } from "remix-validated-form";
import { z } from "zod";
import { Select } from "~/components/form/select";
import { SubmitButton } from "~/components/form/submit-button";
import { validate } from "~/components/form/validate.server";
import { Link } from "~/components/link";
import { db } from "~/db.server";
import { CreateExerciseItemDocument } from "~/graphql/generated/documents";
import { gql } from "~/graphql/graphql.server";

const validator = withZod(
  z.object({ exerciseTypeId: z.string(), returnTo: z.string().optional() })
);

export async function loader({ request, params }: LoaderFunctionArgs) {
  const { id: userId } = await authenticator.isAuthenticated(request, {
    failureRedirect: "/",
  });

  const { data } = await gql({
    document: CreateExerciseItemDocument,
    request,
    variables: {},
  });

  return json(data);
}

export async function action({ request, params }: ActionFunctionArgs) {
  const { id: userId } = await authenticator.isAuthenticated(request, {
    failureRedirect: "/",
  });
  const { exerciseId } = await z
    .object({ exerciseId: z.string() })
    .parse(params);

  const data = await validate({ request, validator });

  const activity = await db.activity.findFirstOrThrow({
    where: { id: exerciseId, userId },
    include: { exerciseItems: true },
  });

  await db.exerciseItem.create({
    data: {
      order: Math.max(0, ...activity.exerciseItems.map((i) => i.order)) + 1,
      activityId: activity.id,
      exerciseTypeId: data.exerciseTypeId,
    },
  });

  return redirect(data.returnTo ?? "/exercises/" + activity.id);
}

export default function Activity() {
  const { exerciseId } = useParams();
  const data = useLoaderData<typeof loader>();

  return (
    <Container py={5}>
      <HiddenReturnToInput />
      <ValidatedForm method="post" validator={validator}>
        <Stack spacing={5}>
          <Heading as="h1">Ny övning</Heading>
          <Box>
            <Select label="Övning" name="exerciseTypeId">
              {data?.exerciseTypes.edges.map((item) => (
                <option value={item.node?.id}>{item.node?.name}</option>
              ))}
            </Select>
            <Link
              fontSize="sm"
              textDecoration="underline"
              to={`/exercise-types/create?returnTo=${encodeURIComponent(
                `/exercises/${exerciseId}/items/create`
              )}`}
            >
              Skapa ny
            </Link>
          </Box>
          <SubmitButton>Spara</SubmitButton>
        </Stack>
      </ValidatedForm>
    </Container>
  );
}
