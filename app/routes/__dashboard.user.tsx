import { Box, Button, Container, Heading, Stack } from "@chakra-ui/react";
import type { LoaderArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { withZod } from "@remix-validated-form/with-zod";
import { ValidatedForm } from "remix-validated-form";
import { z } from "zod";
import { authenticator } from "~/auth.server";
import { Input } from "~/components/form/input";
import { SubmitButton } from "~/components/form/submit-button";
import { validate } from "~/components/form/validate.server";
import { db } from "~/db.server";

const validator = withZod(
  z.object({
    maxPulse: z.union([
      z
        .literal("")
        .nullable()
        .optional()
        .transform(() => null),
      z.coerce
        .number()
        .max(300, "Orimlig maxpuls.")
        .min(40, "Orimlig maxpuls."),
    ]),
  })
);

export async function action({ request }: LoaderArgs) {
  const sessionUser = await authenticator.isAuthenticated(request, {
    failureRedirect: "/",
  });
  const { maxPulse } = await validate({ request, validator });
  await db.user.update({
    where: { id: sessionUser.id },
    data: { maxPulse },
  });
  const url = new URL(request.url);
  const redirectTo = url.searchParams.get("returnTo") ?? "/user";
  return redirect(redirectTo);
}

export async function loader({ request }: LoaderArgs) {
  const sessionUser = await authenticator.isAuthenticated(request, {
    failureRedirect: "/",
  });
  const user = await db.user.findUniqueOrThrow({
    where: { id: sessionUser.id },
  });
  return json({ user });
}

export default function User() {
  const { user } = useLoaderData<typeof loader>();
  return (
    <Container py={5}>
      <Stack spacing={5}>
        <ValidatedForm validator={validator} method="post">
          <Stack spacing={5}>
            <Heading as="h1">Personliga inställningar</Heading>
            <Input
              label="Maxpuls"
              name="maxPulse"
              type="number"
              defaultValue={user.maxPulse?.toFixed(0) ?? undefined}
            />
            <Box>
              <SubmitButton colorScheme="green">Spara</SubmitButton>
            </Box>
          </Stack>
        </ValidatedForm>

        <Heading as="h2">Rensa aviseringsinställningar</Heading>
        <Button
          onClick={async () => {
            const registration = await navigator.serviceWorker.getRegistration(
              "/sw.js"
            );
            if (!registration) {
              throw new Error("No registration");
            }
            registration.pushManager
              .getSubscription()
              .then((sub) => sub?.unsubscribe());
          }}
        >
          Rensa på denna enhet
        </Button>
      </Stack>
    </Container>
  );
}
