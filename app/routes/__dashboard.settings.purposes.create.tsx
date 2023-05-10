import { Box, Container, HStack, Heading, Stack } from "@chakra-ui/react";
import type { LoaderArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { withZod } from "@remix-validated-form/with-zod";
import { ValidatedForm } from "remix-validated-form";
import { z } from "zod";
import { authenticator } from "~/auth.server";
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

export async function action({ request }: LoaderArgs) {
  const sessionUser = await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  });
  const user = await db.user.findUniqueOrThrow({
    where: { id: sessionUser.id },
  });
  if (user.email !== "jonas@jdahl.se") {
    throw new Error("Invalid user");
  }

  const data = await validate({ request, validator });

  await db.activityPurpose.createMany({
    data: data.entries.map((i) => ({ label: i })),
  });

  return redirect("/settings/purposes");
}

export async function loader({ request }: LoaderArgs) {
  const sessionUser = await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  });
  const user = await db.user.findUniqueOrThrow({
    where: { id: sessionUser.id },
  });
  if (user.email !== "jonas@jdahl.se") {
    throw new Error("Invalid user");
  }

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