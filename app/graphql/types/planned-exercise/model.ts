import type { PlannedActivity } from "@prisma/client";

export type PlannedExerciseModel = {
  type: "PlannedExercise";
  value: PlannedActivity;
};
