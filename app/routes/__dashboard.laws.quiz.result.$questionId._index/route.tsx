import { Box, Container, Heading, Stack } from "@chakra-ui/react";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { ButtonLink } from "~/components/button-link";

export async function loader({ request, params }: LoaderFunctionArgs) {
  return json({
    success: new URL(request.url).searchParams.get("success") === "yes",
  });
}

export default function Question() {
  const { success } = useLoaderData<typeof loader>();

  return (
    <Container py={5}>
      <Stack spacing={5}>
        <Heading as="h1">{success ? "Rätt" : "Fel"}</Heading>
        <Box>
          <ButtonLink colorScheme="blue" to="/laws/quiz">
            Nästa fråga
          </ButtonLink>
        </Box>
      </Stack>
    </Container>
  );
}
