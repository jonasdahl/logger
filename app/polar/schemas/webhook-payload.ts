import { z } from "zod";
import { webhookPayloadExercise } from "./webhook-payload-exercise";
import { webhookPing } from "./webhook-ping";

export const webhookPayload = z.union([webhookPing, webhookPayloadExercise]);
