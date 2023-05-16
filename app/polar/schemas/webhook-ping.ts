import { DateTime } from "luxon";
import { z } from "zod";

export const webhookPing = z.object({
  timestamp: z.string().transform((s) => DateTime.fromISO(s)),
  event: z.literal("PING"),
});
