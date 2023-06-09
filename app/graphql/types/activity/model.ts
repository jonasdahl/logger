import type { ExerciseModel } from "../exercise/model";
import type { FogisGameModel } from "../fogis-game/model";

export type ActivityModel = FogisGameModel | ExerciseModel;
