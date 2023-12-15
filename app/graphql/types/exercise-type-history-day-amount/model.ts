import type {
  ExerciseItemLoad,
  ExerciseItemLoadAmount,
  ExerciseLoadType,
  ExerciseType,
} from "@prisma/client";
import { DateTime } from "luxon";

export type ExerciseTypeHistoryDayAmountModel = {
  exerciseType: ExerciseType;
  dayStart: DateTime;
  loadAmounts: (ExerciseItemLoadAmount & {
    loads: (ExerciseItemLoad & { exerciseLoadType: ExerciseLoadType })[];
  })[];
};
