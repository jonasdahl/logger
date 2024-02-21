import {
  Box,
  Checkbox,
  Container,
  Heading,
  Radio,
  RadioGroup,
  Stack,
} from "@chakra-ui/react";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { withZod } from "@remix-validated-form/with-zod";
import type { ReactNode } from "react";
import { ValidatedForm } from "remix-validated-form";
import { z } from "zod";
import { authenticator } from "~/auth.server";
import { ErrorText } from "~/components/form/error-text";
import { SubmitButton } from "~/components/form/submit-button";
import { validate } from "~/components/form/validate.server";
import { db } from "~/db.server";
import { HiddenReturnToInput } from "~/services/return-to";

const validator = withZod(
  z.object({
    questionId: z.string(),
    answer: z
      .union([z.string(), z.array(z.string())])
      .transform((s) => (typeof s === "string" ? [s] : s)),
  })
);

export async function action({ request }: ActionFunctionArgs) {
  await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  });

  const { answer, questionId } = await validate({ request, validator });

  const question = await db.lawsQuestion.findUniqueOrThrow({
    where: { id: questionId },
    include: {
      answerAlternatives: true,
    },
  });

  const success =
    question.answerAlternatives
      .filter((x) => x.isCorrect)
      .every((x) => answer.includes(x.id)) &&
    question.answerAlternatives
      .filter((x) => !x.isCorrect)
      .every((x) => !answer.includes(x.id)) &&
    answer.every((x) =>
      question.answerAlternatives.map((x) => x.id).includes(x)
    );

  return redirect(
    `/laws/quiz/result/${questionId}?success=${success ? "yes" : "no"}`
  );
}

export async function loader({ request, params }: LoaderFunctionArgs) {
  const count = await db.lawsQuestion.count({ where: { isEnabled: true } });
  const question = await db.lawsQuestion.findFirstOrThrow({
    where: { isEnabled: true },
    orderBy: {
      id: "asc",
    },
    skip: Math.floor(Math.random() * count),
    take: 1,
    include: {
      answerAlternatives: true,
    },
  });

  return json({
    question: { id: question.id, question: question.question },
    alternatives: question.answerAlternatives
      .map((a) => ({
        id: a.id,
        text: a.text,
      }))
      .sort(() => Math.random() - 0.5),
    multiple: question.answerAlternatives.filter((x) => x.isCorrect).length > 1,
  });
}

export default function Question() {
  const { alternatives, question, multiple } = useLoaderData<typeof loader>();

  return (
    <Container py={5}>
      <ValidatedForm validator={validator} method="post">
        <HiddenReturnToInput />
        <ErrorText />
        <input type="hidden" name="questionId" value={question.id} />
        <Stack spacing={5}>
          <Heading>Regelfråga</Heading>

          <Box>{question.question}</Box>
          <Wrapper multiple={multiple}>
            <Stack>
              {alternatives.map((alternative) => {
                if (multiple) {
                  return (
                    <Box key={alternative.id}>
                      <Checkbox name="answer" value={alternative.id}>
                        {alternative.text}
                      </Checkbox>
                    </Box>
                  );
                }
                return (
                  <Box key={alternative.id}>
                    <Radio value={alternative.id}>{alternative.text}</Radio>
                  </Box>
                );
              })}
            </Stack>
          </Wrapper>

          <Box>
            <SubmitButton>Svara</SubmitButton>
          </Box>
        </Stack>
      </ValidatedForm>
    </Container>
  );
}

function Wrapper({
  multiple,
  children,
}: {
  multiple: boolean;
  children: ReactNode;
}) {
  if (!multiple) {
    return <RadioGroup name="answer">{children}</RadioGroup>;
  }
  return <>{children}</>;
}
