import { z } from "zod";
import { webhookType } from "./webhook-type";

export const webhookInfo = z.object({
  data: z.array(
    z.object({
      id: z.string(),
      events: z.array(webhookType),
      url: z.string(),
    })
  ),
});
