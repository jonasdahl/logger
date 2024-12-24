import {
  Box,
  Button,
  Container,
  Heading,
  HStack,
  Spacer,
  Stack,
} from "@chakra-ui/react";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";

import type { ReactNode } from "react";
import { authenticator } from "~/.server/auth.server";
import { ButtonLink } from "~/components/button-link";
import { db } from "~/db.server";

export async function loader({ request }: LoaderFunctionArgs) {
  const sessionUser = await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  });
  const user = await db.user.findFirstOrThrow({
    where: { id: sessionUser.id },
  });
  if (user.onboardedAt === null) {
    await db.user.update({
      where: { id: user.id },
      data: { onboardedAt: new Date() },
    });
  }
  return json({ user: { polarUserId: user.polarUserId } });
}

export default function Connections() {
  const { user } = useLoaderData<typeof loader>();

  return (
    <Container py={5}>
      <Stack spacing={5}>
        <Heading>Anslutningar</Heading>
        <Heading size="md">Engångsanslutningar</Heading>
        <Stack>
          <AvailableConnection
            name="Fogis"
            callToActionText="Synka nu"
            action="/connections/fogis"
          />
        </Stack>

        <Heading size="md">Permanenta</Heading>
        <Stack>
          {user.polarUserId ? (
            <WorkingConnection name="Polar">
              <Form action="/connections/polar/sync" method="post">
                <Button type="submit" size="sm" colorScheme="green">
                  Synka
                </Button>
              </Form>
              <ButtonLink
                to="/connections/polar/remove"
                size="sm"
                variant="destructive"
              >
                Ta bort
              </ButtonLink>
            </WorkingConnection>
          ) : (
            <AvailableConnection
              name="Polar"
              callToActionText="Lägg till"
              action="/connections/polar"
            />
          )}
        </Stack>
      </Stack>
    </Container>
  );
}

function AvailableConnection({
  name,
  callToActionText,
  action,
}: {
  name: string;
  callToActionText: string;
  action: string;
}) {
  return (
    <HStack p={3} bg="blue.200" borderRadius="md">
      <Box fontWeight="bold">{name}</Box>
      <Spacer />
      <ButtonLink to={action} size="sm" variant="outline">
        {callToActionText}
      </ButtonLink>
    </HStack>
  );
}

function WorkingConnection({
  name,
  children,
}: {
  name: string;
  children: ReactNode;
}) {
  return (
    <HStack p={3} bg="blue.200" borderRadius="md">
      <Box fontWeight="bold">{name}</Box>
      <Spacer />
      {children}
    </HStack>
  );
}
