import { Box, Container, HStack, Heading, Stack } from "@chakra-ui/react";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { withZod } from "@remix-validated-form/with-zod";
import { ValidatedForm } from "remix-validated-form";
import { z } from "zod";
import { assertIsAdmin, authenticator } from "~/auth.server";
import { SubmitButton } from "~/components/form/submit-button";
import { Textarea } from "~/components/form/textarea";
import { validate } from "~/components/form/validate.server";
import { db } from "~/db.server";

const validator = withZod(
  z.object({
    entries: z.string().transform((s) =>
      s
        .split("\n")
        .map((x) => x.trim())
        .filter((x) => !!x)
    ),
  })
);

export async function action({ request }: LoaderFunctionArgs) {
  const sessionUser = await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  });
  await assertIsAdmin(sessionUser.id);
  const data = await validate({ request, validator });

  await db.activityPurpose.createMany({
    data: data.entries.map((i) => ({ label: i })),
  });

  return redirect("/settings/purposes");
}

export async function loader({ request }: LoaderFunctionArgs) {
  const sessionUser = await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  });
  await assertIsAdmin(sessionUser.id);
  return json({});
}

export default function SettingsIndex() {
  return (
    <Container maxW="container.lg" py={5}>
      <Stack>
        <HStack>
          <Heading>Skapa träningssyften</Heading>
        </HStack>
        <Box>Lägg till en per rad nedan</Box>
        <ValidatedForm validator={validator} method="post">
          <Stack>
            <Textarea
              label="Träningssyften (en per rad kommer skapas)"
              name="entries"
            />
            <Box>
              <SubmitButton>Skapa</SubmitButton>
            </Box>
          </Stack>
        </ValidatedForm>
      </Stack>
    </Container>
  );
}
