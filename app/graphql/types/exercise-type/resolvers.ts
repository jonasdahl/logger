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
      : parent.defaultExerciseAmountType === ExerciseAmountType.Levels
      ? AmountType.Levels
      : AmountType.Repetitions,
  loadTypes: (parent) =>
    db.exerciseLoadType.findMany({ where: { exerciseTypeId: parent.id } }),
  history: (parent) => parent,
  lastExerciseItem: (parent) =>
    db.exerciseItem.findFirst({
      where: { exerciseTypeId: parent.id, deletedAt: null },
      orderBy: [
        { activity: { time: "desc" } },
        { order: "desc" },
        { createdAt: "desc" },
      ],
    }),
  levels: async (parent) => {
    return await db.exerciseTypeLevel.findMany({
      where: { deletedAt: null, exerciseTypeId: parent.id },
      orderBy: { order: "asc" },
    });
  },
  categoryTags: async (parent) => {
    return await db.categoryTag.findMany({
      where: { exerciseTypes: { some: { id: parent.id } } },
      orderBy: { name: "asc" },
    });
  },
};
