import {
  Box,
  Button,
  Card,
  Center,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Stack,
} from "@chakra-ui/react";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import { authenticator } from "~/.server/auth.server";
import { Container } from "~/components/ui/container";
import { InlineLink } from "~/components/ui/inline-link";
import { commitSession, getSessionFromRequest } from "~/session.server";

export async function loader({ request }: LoaderFunctionArgs) {
  await authenticator.isAuthenticated(request, {
    successRedirect: "/",
  });

  const session = await getSessionFromRequest(request);
  const error = session.get(authenticator.sessionErrorKey as "user");
  return json(
    { error },
    { headers: { "Set-Cookie": await commitSession(session) } }
  );
}

export async function action({ request }: ActionFunctionArgs) {
  return await authenticator.authenticate("user-pass", request, {
    successRedirect: "/",
    failureRedirect: "/login",
  });
}

export default function Login() {
  const { error } = useLoaderData<typeof loader>();
  return (
    <Box
      bg="blue.100"
      h="100%"
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      <Container className="max-w-[30rem] pb-8">
        <Card p={5}>
          <Form method="post">
            <Stack spacing={6}>
              <FormControl isInvalid={!!error}>
                <FormLabel>E-postadress</FormLabel>
                <Input autoFocus type="email" name="email" required />
                <FormErrorMessage>
                  Vänligen kontrollera e-postadressen.
                </FormErrorMessage>
              </FormControl>
              <FormControl isInvalid={!!error}>
                <FormLabel>Lösenord</FormLabel>
                <Input
                  type="password"
                  name="password"
                  autoComplete="current-password"
                  required
                />
                <FormErrorMessage>
                  Vänligen kontrollera lösenordet.
                </FormErrorMessage>
              </FormControl>
              <Button type="submit" colorScheme="blue" bg="blue.700">
                Logga in
              </Button>
              <Center>
                <InlineLink to="/register">Skapa konto</InlineLink>
              </Center>
            </Stack>
          </Form>
        </Card>
      </Container>
    </Box>
  );
}
