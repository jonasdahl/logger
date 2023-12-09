import { Button, Container, Heading, Stack } from "@chakra-ui/react";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form } from "@remix-run/react";
import { authenticator } from "~/auth.server";
import { db } from "~/db.server";

export async function action({ request }: LoaderFunctionArgs) {
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: "/connections",
  });

  await db.user.update({
    where: { id: user.id },
    data: { polarAccessToken: null, polarUserId: null },
  });

  return redirect("/connections");
}

export async function loader() {
  return json({});
}

export default function RemovePolar() {
  return (
    <Container py={5}>
      <Stack>
        <Heading>Vill du ta bort Polar-integrationen?</Heading>
        <Form method="post">
          <Button type="submit" colorScheme="red">
            Ja
          </Button>
        </Form>
      </Stack>
    </Container>
  );
}
