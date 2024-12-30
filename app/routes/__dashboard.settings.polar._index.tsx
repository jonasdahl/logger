import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import { withZod } from "@remix-validated-form/with-zod";
import { ValidatedForm } from "remix-validated-form";
import { z } from "zod";
import { assertIsAdmin, authenticator } from "~/.server/auth.server";
import { SubmitButton } from "~/components/form/submit-button";
import { validate } from "~/components/form/validate.server";
import { ValidatedInputField } from "~/components/form/validated-input-field";
import { H1 } from "~/components/headings";
import { Alert, AlertTitle } from "~/components/ui/alert";
import { Button } from "~/components/ui/button";
import { Container } from "~/components/ui/container";
import { FormStack } from "~/components/ui/form-stack";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { db } from "~/db.server";
import { createdWebhook } from "~/polar/schemas/created-webhook";
import { webhookInfo } from "~/polar/schemas/webhook-info";
import { polarClientId, polarClientSecret } from "~/secrets.server";

const validator = withZod(z.object({ url: z.string().url() }));

export async function action({ request }: ActionFunctionArgs) {
  const sessionUser = await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  });
  await assertIsAdmin(sessionUser.id);

  const { url } = await validate({ validator, request });

  const res = await fetch(`https://www.polaraccesslink.com/v3/webhooks`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      Authorization: `Basic ${Buffer.from(
        `${polarClientId}:${polarClientSecret}`,
        "utf-8"
      ).toString("base64")}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ events: ["EXERCISE"], url }),
  });

  if (res.status === 409) {
    console.log(res.status, res.statusText);
    throw new Error("Webhook already existed");
  }

  if (res.status === 400) {
    console.log(res.status, res.statusText);
    throw new Error("Webhook request was bad");
  }

  if (res.status !== 201) {
    console.log(res.status, res.statusText);
    throw new Error("Webhook request failed");
  }

  const { data } = createdWebhook.parse(await res.json());

  // Delete all previous webhook references, we can only have one!
  await db.polarWebhook.deleteMany();

  await db.polarWebhook.create({
    data: {
      polarWebhookId: data.id,
      polarWebhookSignatureSecretKey: data.signature_secret_key,
    },
  });

  return redirect("/settings/polar");
}

export async function loader({ request }: LoaderFunctionArgs) {
  const sessionUser = await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  });
  await assertIsAdmin(sessionUser.id);

  const res = await fetch(`https://www.polaraccesslink.com/v3/webhooks`, {
    headers: {
      Accept: "application/json",
      Authorization: `Basic ${Buffer.from(
        `${polarClientId}:${polarClientSecret}`,
        "utf-8"
      ).toString("base64")}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to get webhooks");
  }

  const jsonData = await res.json();

  const data = webhookInfo.parse(jsonData);

  const webhooks = await db.polarWebhook.findMany();

  const defaultUrl = new URL(request.url);
  defaultUrl.pathname = "/connections/polar/webhook";

  return { webhook: data, webhooks, defaultUrl: defaultUrl.toString() };
}

export default function SettingsIndex() {
  const { webhook, webhooks, defaultUrl } = useLoaderData<typeof loader>();

  return (
    <Container className="flex flex-col gap-5">
      <H1>Polar settings</H1>

      <ValidatedForm validator={validator} method="post">
        <FormStack>
          <ValidatedInputField
            name="url"
            label="URL"
            defaultValue={defaultUrl}
          />
          <div>
            <SubmitButton>Create webhook</SubmitButton>
          </div>
        </FormStack>
      </ValidatedForm>

      <H1>Active webhooks</H1>
      {!webhook.data.length ? (
        <Alert>
          <AlertTitle>No webhooks installed</AlertTitle>
        </Alert>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>URL</TableHead>
              <TableHead>Events</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {webhook.data.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.id}</TableCell>
                <TableCell>{item.url}</TableCell>
                <TableCell>{item.events.join(", ")}</TableCell>
                <TableCell>
                  <Form
                    action={`/settings/polar/delete-webhook/${item.id}`}
                    method="post"
                  >
                    <Button
                      type="submit"
                      variant="destructive-link"
                      size="inline"
                    >
                      Delete
                    </Button>
                  </Form>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <H1>Stored webhooks</H1>
      {!webhooks.length ? (
        <Alert>
          <AlertTitle>No webhooks saved</AlertTitle>
        </Alert>
      ) : (
        <Table>
          <TableBody>
            {webhooks.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.polarWebhookId}</TableCell>
                <TableCell>{item.polarWebhookSignatureSecretKey}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </Container>
  );
}
