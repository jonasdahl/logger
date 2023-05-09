import { DateTime, Duration } from "luxon";
import { z } from "zod";

export const exercise = z.object({
  id: z.number(),
  "upload-time": z.string().transform((s) => DateTime.fromISO(s)),
  "polar-user": z.string(),
  "transaction-id": z.number(),
  device: z.string().optional(),
  "device-id": z.string().optional(),
  "start-time": z.string().transform((s) => DateTime.fromISO(s)),
  "start-time-utc-offset": z.number().optional(),
  duration: z.string().transform((s) => Duration.fromISO(s)),
  calories: z.number().optional(),
  distance: z.number().optional(),
  "heart-rate": z
    .object({
      average: z.number(),
      maximum: z.number(),
    })
    .optional()
    .nullable(),
  "training-load": z.number().optional(),
  sport: z.string().optional(),
  "has-route": z.boolean().optional(),
  "club-id": z.number().optional(),
  "club-name": z.string().optional(),
  "detailed-sport-info": z.string().optional(),
  "fat-percentage": z.number().optional(),
  "carbohydrate-percentage": z.number().optional(),
  "protein-percentage": z.number().optional(),
  "running-index": z.number().optional(),
  "training-load-pro": z
    .object({
      data: z.string().optional(),
      "cardio-load": z.number().optional(),
      "muscle-load": z.number().optional(),
      "perceived-load": z.number().optional(),
      "cardio-load-interpretation": z.string().optional(),
      "muscle-load-interpretation": z.string().optional(),
      "perceived-load-interpretation": z.string().optional(),
      "user-rpe": z.string().optional(),
    })

    .nullable()
    .optional(),
});
