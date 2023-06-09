import type { PushSubscription } from "@prisma/client";
import webpush from "web-push";
import { vapidKeys } from "~/secrets.server";

webpush.setVapidDetails(
  "mailto:jonas@jdahl.se",
  vapidKeys.publicKey,
  vapidKeys.privateKey
);

export async function notify(subscription: PushSubscription, text: string) {
  console.log("Sending notification:", text);
  console.log("keys:", subscription.keyAuth, subscription.keyP256dh);
  const res = await webpush.sendNotification(
    {
      endpoint: subscription.endpoint,
      keys: {
        auth: subscription.keyAuth,
        p256dh: subscription.keyP256dh,
      },
    },
    text
  );
  return res;
}
