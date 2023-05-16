import { z } from "zod";

export const samples = z.object({
  samples: z.array(z.string()),
});
