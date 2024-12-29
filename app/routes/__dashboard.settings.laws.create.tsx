import {
  Input as ChakraInput,
  Checkbox,
  Container,
  Heading,
  IconButton,
  Stack,
  Table,
  Tbody,
  Td,
  Tr,
} from "@chakra-ui/react";
import { faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { withZod } from "@remix-validated-form/with-zod";
import { useState } from "react";
import { ValidatedForm } from "remix-validated-form";
import { v4 } from "uuid";
import { z } from "zod";
import { assertIsAdmin, authenticator } from "~/.server/auth.server";
import { SubmitButton } from "~/components/form/submit-button";

import { ValidatedTextareaField } from "~/components/form/textarea";
import { validate } from "~/components/form/validate.server";
import { db } from "~/db.server";

const baseSchema = z.object({
  question: z.string(),
  alternatives: z.record(
    z.object({
      text: z.string(),
      correct: z
        .literal("yes")
        .optional()
        .transform((s) => s === "yes"),
    })
  ),
});

const validator = withZod(baseSchema);

export async function loader({ request }: LoaderFunctionArgs) {
  const sessionUser = await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  });
  await assertIsAdmin(sessionUser.id);
  return json({});
}

export async function action({ request, params }: ActionFunctionArgs) {
  const sessionUser = await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  });
  await assertIsAdmin(sessionUser.id);

  const data = await validate({ request, validator });

  await db.lawsQuestion.create({
    data: {
      question: data.question,
      answerAlternatives: {
        create: Object.values(data.alternatives).map((a) => ({
          text: a.text,
          isCorrect: a.correct,
        })),
      },
    },
  });

  return redirect("/settings/laws");
}

export default function SettingsLawsCreate() {
  const [alternativeIds, setAlternativeIds] = useState([
    v4(),
    v4(),
    v4(),
    v4(),
  ]);

  return (
    <Container maxW="container.lg" py={5}>
      <Stack spacing={5}>
        <Heading>Skapa fråga</Heading>

        <ValidatedForm validator={validator} method="post">
          <Stack spacing={5}>
            <ValidatedTextareaField label="Fråga" name="question" />
            <Table size="sm">
              <Tbody>
                {alternativeIds.map((id, i) => (
                  <Tr key={id}>
                    <Td w={1} pr={0}>
                      <Checkbox
                        name={`alternatives[${id}].correct`}
                        value="yes"
                      />
                    </Td>
                    <Td>
                      <ChakraInput
                        placeholder={`Alternativ ${i + 1}`}
                        name={`alternatives[${id}].text`}
                      />
                    </Td>
                    <Td w={1} pl={0}>
                      <IconButton
                        aria-label="Ta bort"
                        icon={<FontAwesomeIcon icon={faTrash} />}
                        colorScheme="red"
                        variant="ghost"
                        onClick={() =>
                          setAlternativeIds((ids) =>
                            ids.filter((x) => x !== id)
                          )
                        }
                      />
                    </Td>
                  </Tr>
                ))}
                <Tr>
                  <Td colSpan={2} />
                  <Td w={1} pl={0}>
                    <IconButton
                      aria-label="Lägg till"
                      icon={<FontAwesomeIcon icon={faPlus} />}
                      colorScheme="green"
                      variant="ghost"
                      onClick={() => setAlternativeIds((ids) => [...ids, v4()])}
                    />
                  </Td>
                </Tr>
              </Tbody>
            </Table>
            <div>
              <SubmitButton>Skapa</SubmitButton>
            </div>
          </Stack>
        </ValidatedForm>
      </Stack>
    </Container>
  );
}
