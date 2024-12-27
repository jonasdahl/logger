import type { Goal } from "@prisma/client";

export type GoalPerformExerciseTypeModel = Goal & {
  type: "PerformExerciseType";
};
