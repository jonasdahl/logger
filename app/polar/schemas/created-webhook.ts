import { z } from "zod";
import { webhookType } from "./webhook-type";

export const createdWebhook = z.object({
  data: z.object({
    id: z.string(),
    events: z.array(webhookType),
    url: z.string(),
    signature_secret_key: z.string(),
  }),
});
