import type { ExerciseModel } from "../exercise/model";
import type { FogisGameModel } from "../fogis-game/model";
import type { PlannedExerciseModel } from "../planned-exercise/model";

export type ActivityModel =
  | FogisGameModel
  | ExerciseModel
  | PlannedExerciseModel;
