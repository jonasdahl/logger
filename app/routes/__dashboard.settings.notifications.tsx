import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import { assertIsAdmin, authenticator } from "~/.server/auth.server";
import { H1 } from "~/components/headings";
import { Button } from "~/components/ui/button";
import { Container } from "~/components/ui/container";
import { db } from "~/db.server";
import { notify } from "~/push/notifications.server";

export async function action({ request }: ActionFunctionArgs) {
  const sessionUser = await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  });
  await assertIsAdmin(sessionUser.id);

  const formData = await request.formData();
  const action = formData.get("_action");

  if (action === "truncate") {
    await db.pushSubscription.deleteMany({});
  }

  if (action === "test") {
    const pushes = await db.pushSubscription.findMany({});
    for (const push of pushes) {
      await notify(push, "This is a test.").catch((e) => console.log(e));
    }
  }

  return redirect("/settings/notifications");
}

export async function loader({ request }: LoaderFunctionArgs) {
  const sessionUser = await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  });
  await assertIsAdmin(sessionUser.id);
  const count = await db.pushSubscription.count();
  return { count };
}

export default function Notifications() {
  const { count } = useLoaderData<typeof loader>();
  return (
    <Container className="flex flex-col gap-5">
      <H1>Aviseringsprenumerationer</H1>
      <div>{count}</div>
      <Form method="post">
        <input type="hidden" name="_action" value="truncate" />
        <Button type="submit">Radera alla</Button>
      </Form>
      <Form method="post">
        <input type="hidden" name="_action" value="test" />
        <Button type="submit">Testa alla</Button>
      </Form>
    </Container>
  );
}
