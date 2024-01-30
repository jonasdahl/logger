import { type ExerciseTypeLevelResolvers } from "~/graphql/generated/graphql";

export const exerciseTypeLevelResolvers: ExerciseTypeLevelResolvers = {
  id: (parent) => parent.id,
  name: (parent) => parent.name,
  ordinal: (parent) => parent.order ?? 0,
};
