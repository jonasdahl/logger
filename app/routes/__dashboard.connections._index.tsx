import {
  Badge,
  Box,
  Container,
  Heading,
  HStack,
  Spacer,
  Stack,
} from "@chakra-ui/react";
import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { pick } from "lodash";
import { authenticator } from "~/auth.server";
import { ButtonLink } from "~/components/button-link";

export async function loader({ request }: LoaderArgs) {
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  });
  return json({ user: pick(user, "polarUserId") });
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
            <WorkingConnection name="Polar" statusText="Tillagd" />
          ) : (
            <AvailableConnection
              name="Polar"
              callToActionText="Lägg till"
              action="/connections/polar"
            />
          )}

          {/* <AvailableConnection
            name="Google Calendar"
            callToActionText="Lägg till"
            action="/connections/fogis"
          /> */}
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
      <ButtonLink to={action} size="sm" colorScheme="yellow">
        {callToActionText}
      </ButtonLink>
    </HStack>
  );
}

function WorkingConnection({
  name,
  statusText,
}: {
  name: string;
  statusText: string;
}) {
  return (
    <HStack p={3} bg="blue.200" borderRadius="md">
      <Box fontWeight="bold">{name}</Box>
      <Spacer />
      <Badge colorScheme="green">{statusText}</Badge>
    </HStack>
  );
}
