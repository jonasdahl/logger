import {
  Box,
  Container,
  HStack,
  Heading,
  Spacer,
  Stack,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
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

  const questions = await db.lawsQuestion.findMany({
    include: { answerAlternatives: true },
  });

  return json({
    questions,
  });
}

export default function SettingsLawsIndex() {
  const { questions } = useLoaderData<typeof loader>();
  return (
    <Container maxW="container.lg" py={5}>
      <Stack spacing={5} maxW="100%">
        <HStack>
          <Heading>Regelfrågor</Heading>
          <Spacer />
          <Box>
            <ButtonLink to="/settings/laws/create" colorScheme="green">
              Skapa
            </ButtonLink>
          </Box>
        </HStack>

        <TableContainer>
          <Table size="sm">
            <Thead>
              <Tr>
                <Th>Fråga</Th>
                <Th>Alternativ (rätt)</Th>
                <Th />
              </Tr>
            </Thead>
            <Tbody maxW="100%">
              {questions.map(({ id, question, answerAlternatives }) => (
                <Tr key={id}>
                  <Td>
                    <Text isTruncated>
                      {question.slice(0, 70) +
                        (question.length > 70 ? "..." : "")}
                    </Text>
                  </Td>
                  <Td w={1}>
                    {answerAlternatives.length} (
                    {answerAlternatives.filter((a) => a.isCorrect).length})
                  </Td>
                  <Th />
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
      </Stack>
    </Container>
  );
}
