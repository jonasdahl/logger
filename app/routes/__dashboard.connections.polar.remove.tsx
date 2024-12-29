import type { LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form } from "@remix-run/react";
import { authenticator } from "~/.server/auth.server";
import { H1 } from "~/components/headings";
import { Button } from "~/components/ui/button";
import { Container } from "~/components/ui/container";
import { db } from "~/db.server";

export async function action({ request }: LoaderFunctionArgs) {
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: "/connections",
  });

  await db.user.update({
    where: { id: user.id },
    data: { polarAccessToken: null, polarUserId: null },
  });

  return redirect("/connections");
}

export async function loader() {
  return json({});
}

export default function RemovePolar() {
  return (
    <Container className="flex flex-col gap-3">
      <H1>Vill du ta bort Polar-integrationen?</H1>
      <Form method="post">
        <Button type="submit" variant="destructive">
          Ja
        </Button>
      </Form>
    </Container>
  );
}
