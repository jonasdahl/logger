import {
  Box,
  Container,
  HStack,
  Heading,
  IconButton,
  Spacer,
  Stack,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tooltip,
  Tr,
} from "@chakra-ui/react";
import { faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import { z } from "zod";
import { assertIsAdmin, authenticator } from "~/.server/auth.server";
import { ButtonLink } from "~/components/button-link";
import { db } from "~/db.server";

export async function action({ request, params }: ActionFunctionArgs) {
  const sessionUser = await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  });
  await assertIsAdmin(sessionUser.id);

  const data = await request.formData();
  const questionId = z.string().parse(data.get("questionId"));

  const question = await db.lawsQuestion.findUniqueOrThrow({
    where: { id: questionId },
  });

  await db.lawsQuestion.update({
    where: { id: questionId },
    data: { isEnabled: !question.isEnabled },
  });

  return redirect("/settings/laws");
}

export async function loader({ request }: LoaderFunctionArgs) {
  const sessionUser = await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  });
  await assertIsAdmin(sessionUser.id);

  const questions = await db.lawsQuestion.findMany({
    include: { answerAlternatives: true },
    orderBy: [{ isEnabled: "desc" }, { question: "asc" }, { id: "asc" }],
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
            <ButtonLink to="/settings/laws/create" variant="secondary">
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
              {questions.map(
                ({ id, question, isEnabled, answerAlternatives }) => (
                  <Tr key={id} opacity={!isEnabled ? 0.5 : undefined}>
                    <Td>
                      <Text isTruncated>
                        {question.slice(0, 70) +
                          (question.length > 70 ? "..." : "")}
                      </Text>
                    </Td>
                    <Td w={1}>
                      <Tooltip
                        label={
                          <Stack spacing={1}>
                            {answerAlternatives.map((a) => (
                              <Box key={a.id}>
                                {a.text} {a.isCorrect ? "(rätt)" : "(fel)"}
                              </Box>
                            ))}
                          </Stack>
                        }
                      >
                        <span>
                          {answerAlternatives.length} (
                          {answerAlternatives.filter((a) => a.isCorrect).length}
                          )
                        </span>
                      </Tooltip>
                    </Td>
                    <Td p={0} w={1}>
                      <Form method="post">
                        <input type="hidden" name="questionId" value={id} />
                        <IconButton
                          aria-label="Inaktivera"
                          size="sm"
                          type="submit"
                          variant="ghost"
                          icon={<FontAwesomeIcon icon={faEyeSlash} />}
                        />
                      </Form>
                    </Td>
                  </Tr>
                )
              )}
            </Tbody>
          </Table>
        </TableContainer>
      </Stack>
    </Container>
  );
}
