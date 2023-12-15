import { ExerciseAmountType } from "@prisma/client";
import { db } from "~/db.server";
import {
  AmountType,
  type ExerciseTypeResolvers,
} from "~/graphql/generated/graphql";

export const exerciseTypeResolvers: ExerciseTypeResolvers = {
  id: (parent) => parent.id,
  name: (parent) => parent.name,
  defaultAmountType: (parent) =>
    parent.defaultExerciseAmountType === ExerciseAmountType.Time
      ? AmountType.Time
      : AmountType.Repetitions,
  loadTypes: (parent) =>
    db.exerciseLoadType.findMany({ where: { exerciseTypeId: parent.id } }),
  history: (parent) => parent,
};
