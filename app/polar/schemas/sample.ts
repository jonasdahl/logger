import { z } from "zod";

export const sample = z.object({
  "recording-rate": z.number(),
  "sample-type": z.number(),
  data: z.string().transform((s) => s.split(",")),
});
