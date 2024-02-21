import {
  Box,
  Container,
  HStack,
  Heading,
  Spacer,
  Stack,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { assertIsAdmin, authenticator } from "~/auth.server";
import { ButtonLink } from "~/components/button-link";
import { db } from "~/db.server";

export async function loader({ request }: LoaderFunctionArgs) {
  const sessionUser = await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  });
  await assertIsAdmin(sessionUser.id);

  const questions = await db.lawsQuestion.findMany();

  return json({
    questions,
  });
}

export default function SettingsLawsIndex() {
  const { questions } = useLoaderData<typeof loader>();
  return (
    <Container maxW="container.lg" py={5}>
      <Stack spacing={5}>
        <HStack>
          <Heading>Regelfrågor</Heading>
          <Spacer />
          <Box>
            <ButtonLink to="/settings/laws/create" colorScheme="green">
              Skapa
            </ButtonLink>
          </Box>
        </HStack>

        <Table size="sm">
          <Thead>
            <Tr>
              <Th>Fråga</Th>
            </Tr>
          </Thead>
          <Tbody>
            {questions.map(({ id, question }) => (
              <Tr key={id}>
                <Td isTruncated>{question}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Stack>
    </Container>
  );
}
