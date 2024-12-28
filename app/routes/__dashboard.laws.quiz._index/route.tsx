import { Container, RadioGroup, Stack } from "@chakra-ui/react";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { withZod } from "@remix-validated-form/with-zod";
import type { ReactNode } from "react";
import { ValidatedForm } from "remix-validated-form";
import { z } from "zod";
import { authenticator } from "~/.server/auth.server";
import { ErrorText } from "~/components/form/error-text";
import { SubmitButton } from "~/components/form/submit-button";
import { validate } from "~/components/form/validate.server";
import { H1 } from "~/components/headings";
import { Button } from "~/components/ui/button";
import { Checkbox } from "~/components/ui/checkbox";
import { FormLabel } from "~/components/ui/form-label";
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
          <H1>Regelfråga</H1>

          <div>{question.question}</div>
          <Wrapper multiple={multiple}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {alternatives.map((alternative) => {
                if (multiple) {
                  return (
                    <div
                      key={alternative.id}
                      className="flex items-center space-x-2"
                    >
                      <Checkbox
                        name="answer"
                        id="answer"
                        value={alternative.id}
                      />
                      <FormLabel htmlFor="answer">{alternative.text}</FormLabel>
                    </div>
                  );
                }
                return (
                  <Button
                    variant="outline"
                    value={alternative.id}
                    key={alternative.id}
                    className="truncate"
                  >
                    {alternative.text}
                  </Button>
                );
              })}
            </div>
          </Wrapper>

          <div>
            <SubmitButton>Svara</SubmitButton>
          </div>
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
