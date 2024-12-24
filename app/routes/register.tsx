import { Box, Card, Container, Stack } from "@chakra-ui/react";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { withZod } from "@remix-validated-form/with-zod";
import { ValidatedForm } from "remix-validated-form";
import { z } from "zod";
import { authenticator, signUp } from "~/.server/auth.server";
import { SubmitButton } from "~/components/form/submit-button";
import { validate } from "~/components/form/validate.server";
import { ValidatedInputField } from "~/components/form/validated-input-field";
import { commitSession, getSessionFromRequest } from "~/session.server";

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

export async function loader({ request }: LoaderFunctionArgs) {
  await authenticator.isAuthenticated(request, { successRedirect: "/" });
  const session = await getSessionFromRequest(request);
  const error = session.get(authenticator.sessionErrorKey as "user");
  return json(
    { error },
    { headers: { "Set-Cookie": await commitSession(session) } }
  );
}

export async function action({ request }: ActionFunctionArgs) {
  const data = await validate({ request, validator });
  const session = await getSessionFromRequest(request);
  const user = await signUp(data);
  session.set(authenticator.sessionKey as "user", user);
  return redirect("/", {
    headers: { "Set-Cookie": await commitSession(session) },
  });
}

export default function Register() {
  return (
    <Box
      bg="blue.100"
      h="100%"
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      <Container maxW="30rem" py={5}>
        <Card p={4}>
          <ValidatedForm validator={validator} method="post">
            <Stack spacing={5}>
              <ValidatedInputField
                label="E-postadress"
                name="email"
                type="email"
              />
              <ValidatedInputField
                label="Lösenord"
                name="password"
                type="password"
                autoComplete="new-password"
              />
              <ValidatedInputField
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
    </Box>
  );
}
