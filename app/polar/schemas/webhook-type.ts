import { z } from "zod";

export const webhookType = z.union([
  z.literal("EXERCISE"),
  z.literal("SLEEP"),
  z.literal("CONTINUOUS_HEART_RATE"),
  z.literal("SLEEP_WISE_CIRCADIAN_BEDTIME"),
  z.literal("SLEEP_WISE_ALERTNESS"),
]);
