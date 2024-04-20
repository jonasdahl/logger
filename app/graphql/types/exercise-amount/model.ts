import type {
  ExerciseItemLoad,
  ExerciseItemLoadAmount,
  ExerciseLoadType,
} from "@prisma/client";

export type ExerciseAmountModel = ExerciseItemLoadAmount & {
  loads: (ExerciseItemLoad & { exerciseLoadType: ExerciseLoadType })[];
};
