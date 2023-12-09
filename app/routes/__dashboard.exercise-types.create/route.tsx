import { Box, Container, Heading, Stack } from "@chakra-ui/react";
import { HiddenReturnToInput } from "~/services/return-to";

import { withZod } from "@remix-validated-form/with-zod";
import { ValidatedForm } from "remix-validated-form";
import { z } from "zod";
import { SubmitButton } from "~/components/form/submit-button";

import { ActionFunctionArgs, redirect } from "@remix-run/node";
import { authenticator } from "~/auth.server";
import { Input } from "~/components/form/input";
import { validate } from "~/components/form/validate.server";
import { db } from "~/db.server";

const validator = withZod(
  z.object({ name: z.string(), returnTo: z.string().optional() })
);

export async function action({ request, params }: ActionFunctionArgs) {
  const { id: userId } = await authenticator.isAuthenticated(request, {
    failureRedirect: "/",
  });

  const data = await validate({ request, validator });

  await db.exerciseType.create({
    data: {
      name: data.name,
      userId,
    },
  });

  return redirect(data.returnTo ?? "/");
}

export default function Activity() {
  return (
    <Container py={5}>
      <ValidatedForm method="post" validator={validator}>
        <Stack spacing={5}>
          <Heading as="h1">Ny övningstyp</Heading>
          <Box>
            <Input name="name" label="Name" />
            <HiddenReturnToInput />
          </Box>
          <SubmitButton>Spara</SubmitButton>
        </Stack>
      </ValidatedForm>
    </Container>
  );
}
