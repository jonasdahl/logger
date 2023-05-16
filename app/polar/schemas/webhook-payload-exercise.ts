import { DateTime } from "luxon";
import { z } from "zod";

export const webhookPayloadExercise = z.object({
  timestamp: z.string().transform((s) => DateTime.fromISO(s)),
  event: z.literal("EXERCISE"),
  entity_id: z.string(),
  url: z.string(),
  user_id: z.number(),
});
