import { ExerciseLoadTypeResolvers } from "~/graphql/generated/graphql";

export const exerciseLoadTypeResolvers: ExerciseLoadTypeResolvers = {
  id: (parent) => parent.id,
  name: (parent) => parent.name,
  unit: (parent) => parent.unit,
};
