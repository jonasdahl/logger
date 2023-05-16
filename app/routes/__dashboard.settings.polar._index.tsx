import {
  Alert,
  Box,
  Button,
  Container,
  Heading,
  Stack,
  Table,
  TableContainer,
  Tbody,
  Td,
  Tr,
} from "@chakra-ui/react";
import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import { withZod } from "@remix-validated-form/with-zod";
import { ValidatedForm } from "remix-validated-form";
import { z } from "zod";
import { assertIsAdmin, authenticator } from "~/auth.server";
import { Input } from "~/components/form/input";
import { SubmitButton } from "~/components/form/submit-button";
import { validate } from "~/components/form/validate.server";
import { db } from "~/db.server";
import { createdWebhook } from "~/polar/schemas/created-webhook";
import { webhookInfo } from "~/polar/schemas/webhook-info";
import { polarClientId, polarClientSecret } from "~/secrets.server";

const validator = withZod(z.object({ url: z.string().url() }));

export async function action({ request }: ActionArgs) {
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

  const { data } = createdWebhook.parse(await res.json());

  await db.polarWebhook.create({
    data: {
      polarWebhookId: data.id,
      polarWebhookSignatureSecretKey: data.signature_secret_key,
    },
  });

  return redirect("/settings/polar");
}

export async function loader({ request }: LoaderArgs) {
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

  return json({ webhook: data, webhooks });
}

export default function SettingsIndex() {
  const { webhook, webhooks } = useLoaderData<typeof loader>();

  return (
    <Container maxW="container.lg" py={5}>
      <Stack spacing={5}>
        <Heading>Polar settings</Heading>

        <ValidatedForm validator={validator} method="post">
          <Stack>
            <Input
              name="url"
              label="URL"
              defaultValue="http://localhost:3000/connections/polar/webhook"
            />
            <Box>
              <SubmitButton colorScheme="green">Create webhook</SubmitButton>
            </Box>
          </Stack>
        </ValidatedForm>

        <Heading>Active webhooks</Heading>
        {!webhook.data.length ? (
          <Alert>No webhooks installed</Alert>
        ) : (
          <TableContainer>
            <Table>
              <Tbody>
                {webhook.data.map((item) => (
                  <Tr key={item.id}>
                    <Td>{item.id}</Td>
                    <Td>{item.url}</Td>
                    <Td>{item.events.join(", ")}</Td>
                    <Td>
                      <Form
                        action={`/settings/polar/delete-webhook/${item.id}`}
                        method="post"
                      >
                        <Button type="submit" colorScheme="red" size="sm">
                          Delete
                        </Button>
                      </Form>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>
        )}

        <Heading>Stored webhooks</Heading>
        {!webhooks.length ? (
          <Alert>No webhooks saved</Alert>
        ) : (
          <TableContainer>
            <Table>
              <Tbody>
                {webhooks.map((item) => (
                  <Tr key={item.id}>
                    <Td>{item.polarWebhookId}</Td>
                    <Td>{item.polarWebhookSignatureSecretKey}</Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>
        )}
      </Stack>
    </Container>
  );
}
