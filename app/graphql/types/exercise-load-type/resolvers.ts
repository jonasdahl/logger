import { db } from "~/db.server";
import type { ExerciseLoadTypeResolvers } from "~/graphql/generated/graphql";

export const exerciseLoadTypeResolvers: ExerciseLoadTypeResolvers = {
  id: (parent) => parent.id,
  name: (parent) => parent.name,
  unit: (parent) => parent.unit,
  commonLoads: async (parent) => {
    const performedLoads = await db.exerciseItemLoad.findMany({
      where: { exerciseLoadTypeId: parent.id },
      orderBy: { createdAt: "desc" },
      distinct: ["amountValue"],
      take: 10,
    });
    return performedLoads.map((load) => ({
      type: parent,
      value: load.amountValue,
      unit: parent.unit,
    }));
  },
};
