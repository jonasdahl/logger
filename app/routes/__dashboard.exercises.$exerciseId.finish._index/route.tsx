import type { ActionFunctionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";

import { Form } from "@remix-run/react";
import { authenticator } from "~/.server/auth.server";
import { H2 } from "~/components/headings";
import { Button } from "~/components/ui/button";
import { Container } from "~/components/ui/container";
import { db } from "~/db.server";

export async function action({ request, params }: ActionFunctionArgs) {
  const { id: userId } = await authenticator.isAuthenticated(request, {
    failureRedirect: "/",
  });
  await db.activity.update({
    where: { id: params.exerciseId!, userId },
    data: { endedAt: new Date() },
  });
  return redirect(`/exercises/${params.exerciseId}`);
}

export default function Activity() {
  return (
    <Form method="post">
      <Container className="flex flex-col gap-3">
        <H2>Avsluta pass?</H2>
        <div>Sluttiden kommer sättas till nuvarande klockslag.</div>
        <Button variant="destructive">Ja, avsluta</Button>
      </Container>
    </Form>
  );
}
