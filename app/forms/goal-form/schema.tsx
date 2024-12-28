import { withZod } from "@remix-validated-form/with-zod";
import { z } from "zod";
import { zfd } from "zod-form-data";

export const GoalType = {
  PerformExerciseType: "PerformExerciseType",
  DayOfRest: "DayOfRest",
  DayOfWork: "DayOfWork",
} as const;

export const goalFormSchema = z.intersection(
  z.object({
    name: z.string(),
  }),
  z.union([
    z.object({
      type: z.literal(GoalType.DayOfRest),
      typeDayOfRestNumberOfDays: zfd.numeric(z.number().int().min(1).max(365)),
    }),
    z.object({
      type: z.literal(GoalType.DayOfWork),
      typeDayOfWorkNumberOfDays: zfd.numeric(z.number().int().min(1).max(365)),
    }),
    z.object({
      type: z.literal(GoalType.PerformExerciseType),
      typePerformExerciseTypeExerciseTypeId: z.string().min(1),
      typePerformExerciseTypeNumberOfDays: z.coerce
        .number()
        .int()
        .min(1)
        .max(365),
    }),
  ])
);

export const goalFormValidator = withZod(goalFormSchema);
