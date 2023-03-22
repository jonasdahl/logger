import {
  Button,
  Card,
  Container,
  FormControl,
  FormLabel,
  Input,
  Stack,
} from "@chakra-ui/react";
import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { Form } from "@remix-run/react";
import { authenticator } from "~/auth.server";

export async function loader({ request }: LoaderArgs) {
  return await authenticator.isAuthenticated(request, {
    successRedirect: "/dashboard",
  });
}

export async function action({ request }: ActionArgs) {
  return await authenticator.authenticate("user-pass", request, {
    successRedirect: "/dashboard",
    failureRedirect: "/login",
  });
}

export default function Login() {
  return (
    <Container maxW="30rem" py={5}>
      <Card p={4}>
        <Form method="post">
          <Stack>
            <FormControl>
              <FormLabel>E-postadress</FormLabel>
              <Input type="email" name="email" required />
            </FormControl>
            <FormControl>
              <FormLabel>Lösenord</FormLabel>
              <Input
                type="password"
                name="password"
                autoComplete="current-password"
                required
              />
            </FormControl>
            <Button type="submit">Logga in</Button>
          </Stack>
        </Form>
      </Card>
    </Container>
  );
}
