import type { ActionFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { db } from "~/db.server";
import { webhookPayload } from "~/polar/schemas/webhook-payload";
import { syncPolarUser } from "~/polar/sync-polar-user.server";
import { validateWebhook } from "~/polar/validate-webhook.server";

export async function action({ request }: ActionFunctionArgs) {
  console.log("Polar webhook request: ", [...request.headers.values()]);

  if (request.headers.get("polar-webhook-event") === "PING") {
    return new Response(undefined, { status: 200 });
  }
  const signature = request.headers.get("polar-webhook-signature");
  if (!signature) {
    throw new Error("No signature");
  }
  const text = await request.text();
  const jsonData = webhookPayload.parse(JSON.parse(text));

  // Verify signature
  await validateWebhook({ content: text, signature });

  if (jsonData.event !== "EXERCISE") {
    throw new Error("Got other event than EXERCISE");
  }

  const users = await db.user.findMany({
    where: { polarUserId: jsonData.user_id },
  });

  for (const user of users) {
    if (!user.polarAccessToken || !user.polarUserId) {
      continue;
    }
    try {
      await syncPolarUser({
        polarAccessToken: user.polarAccessToken,
        polarUserId: user.polarUserId,
        userId: user.id,
      });
    } catch (e) {
      console.error("Failed to sync user", user.email);
      console.error(e);
    }
  }

  return json({ jsonData });
}

export async function loader() {
  return json({});
}
