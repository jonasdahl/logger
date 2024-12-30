import { faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import { z } from "zod";
import { assertIsAdmin, authenticator } from "~/.server/auth.server";
import { ButtonLink } from "~/components/button-link";
import { H1 } from "~/components/headings";
import { Button } from "~/components/ui/button";
import { Container } from "~/components/ui/container";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { TitleRow } from "~/components/ui/title-row";
import { SimpleTooltip } from "~/components/ui/tooltip";
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
    <Container className="flex flex-col gap-5">
      <TitleRow
        actions={
          <ButtonLink to="/settings/laws/create" variant="outline">
            Skapa
          </ButtonLink>
        }
      >
        <H1>Regelfrågor</H1>
      </TitleRow>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Fråga</TableHead>
            <TableHead className="w-1 truncate">Alternativ (rätt)</TableHead>
            <TableHead className="w-1"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {questions.map(({ id, question, isEnabled, answerAlternatives }) => (
            <TableRow
              key={id}
              className={!isEnabled ? "opacity-20" : undefined}
            >
              <TableCell className="truncate">
                {question.slice(0, 70) + (question.length > 70 ? "..." : "")}
              </TableCell>
              <TableCell className="w-1 truncate">
                <SimpleTooltip
                  label={
                    <div className="flex flex-col gap-1">
                      {answerAlternatives.map((a) => (
                        <div key={a.id}>
                          {a.text} {a.isCorrect ? "(rätt)" : "(fel)"}
                        </div>
                      ))}
                    </div>
                  }
                >
                  <span>
                    {answerAlternatives.length} (
                    {answerAlternatives.filter((a) => a.isCorrect).length})
                  </span>
                </SimpleTooltip>
              </TableCell>
              <TableCell className="p-0 w-1">
                <Form method="post">
                  <input type="hidden" name="questionId" value={id} />
                  <Button
                    aria-label="Inaktivera"
                    size="sm"
                    type="submit"
                    variant="ghost"
                  >
                    <FontAwesomeIcon icon={faEyeSlash} />
                  </Button>
                </Form>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Container>
  );
}
