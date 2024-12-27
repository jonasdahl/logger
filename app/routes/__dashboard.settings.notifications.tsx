import { Button, Container, Heading, Stack } from "@chakra-ui/react";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import { assertIsAdmin, authenticator } from "~/.server/auth.server";
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
  return json({ count });
}

export default function Notifications() {
  const { count } = useLoaderData<typeof loader>();
  return (
    <Container py={5} maxW="container.xl">
      <Stack spacing={5}>
        <Heading>Aviseringsprenumerationer</Heading>
        <div>{count}</div>
        <Form method="post">
          <input type="hidden" name="_action" value="truncate" />
          <Button type="submit">Radera alla</Button>
        </Form>
        <Form method="post">
          <input type="hidden" name="_action" value="test" />
          <Button type="submit">Testa alla</Button>
        </Form>
      </Stack>
    </Container>
  );
}
