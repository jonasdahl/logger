import { Alert, AlertTitle, Box, HStack, Spacer } from "@chakra-ui/react";
import { ButtonLink } from "~/components/button-link";

export function OnboardingAlert() {
  return (
    <Alert>
      <HStack w="100%">
        <AlertTitle>
          Börja med att sätta upp anslutningar till tredjepartsappar.
        </AlertTitle>
        <Spacer />
        <Box>
          <ButtonLink size="sm" colorScheme="blue" to="/connections">
            Kom igång
          </ButtonLink>
        </Box>
      </HStack>
    </Alert>
  );
}
