import { faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { withZod } from "@remix-validated-form/with-zod";
import { useState } from "react";
import { ValidatedForm } from "remix-validated-form";
import { z } from "zod";
import { assertIsAdmin, authenticator } from "~/.server/auth.server";
import { SubmitButton } from "~/components/form/submit-button";

import { ValidatedTextareaField } from "~/components/form/textarea";
import { validate } from "~/components/form/validate.server";
import { H1 } from "~/components/headings";
import { Button } from "~/components/ui/button";
import { Checkbox } from "~/components/ui/checkbox";
import { Container } from "~/components/ui/container";
import { FormStack } from "~/components/ui/form-stack";
import { Input } from "~/components/ui/input";
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
  return {};
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
    Math.random().toString(),
    Math.random().toString(),
    Math.random().toString(),
    Math.random().toString(),
  ]);

  return (
    <Container className="flex flex-col gap-5">
      <H1>Skapa fråga</H1>

      <ValidatedForm validator={validator} method="post">
        <FormStack>
          <ValidatedTextareaField label="Fråga" name="question" />
          <div className="flex flex-col gap-1">
            {alternativeIds.map((id, i) => (
              <div key={id} className="flex flex-row gap-2 items-center">
                <label className="w-6 flex items-center justify-center">
                  <Checkbox name={`alternatives[${id}].correct`} value="yes" />
                </label>
                <div className="flex-1">
                  <Input
                    placeholder={`Alternativ ${i + 1}`}
                    name={`alternatives[${id}].text`}
                  />
                </div>
                <div>
                  <Button
                    aria-label="Ta bort"
                    variant="destructive-outline"
                    onClick={() =>
                      setAlternativeIds((ids) => ids.filter((x) => x !== id))
                    }
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </Button>
                </div>
              </div>
            ))}
            <div className="flex flex-row gap-2 items-center">
              <div className="w-6" />
              <div className="flex-1" />
              <div>
                <Button
                  type="button"
                  aria-label="Lägg till"
                  onClick={() =>
                    setAlternativeIds((ids) => [
                      ...ids,
                      Math.random().toString(),
                    ])
                  }
                >
                  <FontAwesomeIcon icon={faPlus} />
                </Button>
              </div>
            </div>
          </div>
          <div>
            <SubmitButton>Skapa</SubmitButton>
          </div>
        </FormStack>
      </ValidatedForm>
    </Container>
  );
}
