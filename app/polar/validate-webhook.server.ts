import { createHmac } from "crypto";
import { db } from "~/db.server";

export async function validateWebhook({
  signature,
  content,
}: {
  signature: string;
  content: string;
}) {
  // Verify signature
  const { polarWebhookSignatureSecretKey } =
    await db.polarWebhook.findFirstOrThrow({});
  console.log("using key", polarWebhookSignatureSecretKey);
  const hmac = createHmac("sha256", polarWebhookSignatureSecretKey);
  hmac.update(content);
  const expected = hmac.digest("hex");
  if (signature !== expected) {
    throw new Error("Invalid signature");
  }
}
