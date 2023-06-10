import { Alert, AlertTitle, Box, HStack, Spacer } from "@chakra-ui/react";
import { ButtonLink } from "~/components/button-link";

export function FogisSyncAlert() {
  return (
    <Alert>
      <HStack w="100%">
        <AlertTitle>
          Det var mer än en vecka sedan du synkade mot Fogis.
        </AlertTitle>
        <Spacer />
        <Box>
          <ButtonLink size="sm" colorScheme="blue" to="/connections/fogis">
            Gör det nu
          </ButtonLink>
        </Box>
      </HStack>
    </Alert>
  );
}
