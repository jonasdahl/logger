import { withZod } from "@remix-validated-form/with-zod";
import { z } from "zod";

export const exerciseTypeSchema = z.object({
  name: z.string(),
  returnTo: z.string().optional(),
  defaultAmountType: z.union([
    z.literal("null"),
    z.literal("time"),
    z.literal("repetitions"),
    z.literal("levels"),
  ]),
  loads: z
    .array(z.object({ name: z.string(), unit: z.string().optional() }))
    .optional(),
  levels: z
    .string()
    .transform((s) =>
      s
        .split("\n")
        .map((x) => x.trim())
        .filter((x) => !!x)
    )
    .optional(),
});

export const exerciseTypeValidator = withZod(exerciseTypeSchema);
