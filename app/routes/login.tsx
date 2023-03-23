import {
  Button,
  Card,
  Center,
  Container,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Stack,
} from "@chakra-ui/react";
import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import { authenticator } from "~/auth.server";
import { Link } from "~/components/link";
import { commitSession, getSessionFromRequest } from "~/session.server";

export async function loader({ request }: LoaderArgs) {
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

export async function action({ request }: ActionArgs) {
  return await authenticator.authenticate("user-pass", request, {
    successRedirect: "/",
    failureRedirect: "/login",
  });
}

export default function Login() {
  const { error } = useLoaderData<typeof loader>();
  return (
    <Container maxW="30rem" py={5}>
      <Card p={4}>
        <Form method="post">
          <Stack spacing={5}>
            <FormControl isInvalid={!!error}>
              <FormLabel>E-postadress</FormLabel>
              <Input type="email" name="email" required />
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
              <Link to="/register">Skapa konto</Link>
            </Center>
          </Stack>
        </Form>
      </Card>
    </Container>
  );
}
