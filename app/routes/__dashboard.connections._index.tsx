import {
  Box,
  Container,
  Heading,
  HStack,
  Spacer,
  Stack,
} from "@chakra-ui/react";
import { ButtonLink } from "~/components/button-link";

export default function Connections() {
  return (
    <Container py={5}>
      <Stack spacing={5}>
        <Heading>Anslutningar</Heading>
        <Heading size="md">Engångsanslutningar</Heading>
        <Stack>
          <Connection
            name="Fogis"
            callToActionText="Synka nu"
            action="/connections/fogis"
          />
        </Stack>

        <Heading size="md">Permanenta</Heading>
        <Stack>
          <Connection
            name="Polar"
            callToActionText="Lägg till"
            action="/connections/fogis"
          />
          <Connection
            name="Google Calendar"
            callToActionText="Lägg till"
            action="/connections/fogis"
          />
        </Stack>
      </Stack>
    </Container>
  );
}

function Connection({
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
