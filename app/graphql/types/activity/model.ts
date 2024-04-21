import type { CustomGameModel } from "../custom-game/model";
import type { ExerciseModel } from "../exercise/model";
import type { FogisGameModel } from "../fogis-game/model";
import type { PhysicalTestModel } from "../physical-test/model";
import type { PlannedExerciseModel } from "../planned-exercise/model";
import type { TravelModel } from "../travel/model";

export type ActivityModel =
  | FogisGameModel
  | ExerciseModel
  | PlannedExerciseModel
  | PhysicalTestModel
  | CustomGameModel
  | TravelModel;
