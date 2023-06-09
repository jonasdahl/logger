import type { ActionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { z } from "zod";
import { authenticator } from "~/auth.server";
import { db } from "~/db.server";
import { notify } from "~/push/notifications.server";

const payloadType = z.object({
  endpoint: z.string(),
  keys: z.object({
    auth: z.string(),
    p256dh: z.string(),
  }),
});

export async function action({ request }: ActionArgs) {
  const res = payloadType.parse(await request.json());
  const { id: userId } = await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  });
  const data = await db.pushSubscription.upsert({
    create: {
      userId,
      endpoint: res.endpoint,
      keyP256dh: res.keys.p256dh,
      keyAuth: res.keys.auth,
    },
    update: {
      userId,
      endpoint: res.endpoint,
      keyP256dh: res.keys.p256dh,
      keyAuth: res.keys.auth,
    },
    where: {
      endpoint: res.endpoint,
    },
  });
  await notify(data, "Du får nu aviseringar.");
  return json(data);
}
