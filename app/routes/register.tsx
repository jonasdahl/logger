import { Card, Container, Stack } from "@chakra-ui/react";
import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { withZod } from "@remix-validated-form/with-zod";
import { ValidatedForm, validationError } from "remix-validated-form";
import { z } from "zod";
import { authenticator } from "~/auth.server";
import { Input } from "~/components/form/input";
import { SubmitButton } from "~/components/form/submit-button";
import { authSessionStorage } from "~/session.server";

const validator = withZod(
  z
    .object({
      email: z.string().email("E-postadressen är inte giltig"),
      password: z.string().min(8, "Lösenordet måste vara minst 8 tecken långt"),
      confirmPassword: z
        .string()
        .min(8, "Lösenordet måste vara minst 8 tecken långt"),
    })
    .refine(
      (data) => data.password === data.confirmPassword,
      "Båda lösenorden måste stämma överens"
    )
);

export async function loader({ request }: LoaderArgs) {
  await authenticator.isAuthenticated(request, {
    successRedirect: "/dashboard",
  });

  const session = await authSessionStorage.getSession(
    request.headers.get("cookie")
  );
  const error = session.get(authenticator.sessionErrorKey);
  return json(
    { error },
    {
      headers: {
        "Set-Cookie": await authSessionStorage.commitSession(session),
      },
    }
  );
}

export async function action({ request }: ActionArgs) {
  const data = await validator.validate(await request.formData());
  if (data.error) return validationError(data.error);
  const session = await authSessionStorage.getSession(
    request.headers.get("cookie")
  );
  session.set(authenticator.sessionKey as "user", { id: "" });
  return redirect("/dashboard", {
    headers: {
      "Set-Cookie": await authSessionStorage.commitSession(session),
    },
  });
}

export default function Register() {
  return (
    <Container maxW="30rem" py={5}>
      <Card p={4}>
        <ValidatedForm validator={validator} method="post">
          <Stack spacing={5}>
            <Input label="E-postadress" name="email" type="email" />
            <Input
              label="Lösenord"
              name="password"
              type="password"
              autoComplete="new-password"
            />
            <Input
              label="Upprepa lösenord"
              name="confirmPassword"
              type="password"
              autoComplete="new-password"
            />
            <SubmitButton type="submit" colorScheme="blue" bg="blue.700">
              Skapa konto
            </SubmitButton>
          </Stack>
        </ValidatedForm>
      </Card>
    </Container>
  );
}
