import { ExerciseAmountType } from "@prisma/client";
import { db } from "~/db.server";
import { type ExerciseItemResolvers } from "~/graphql/generated/graphql";

export const exerciseItemResolvers: ExerciseItemResolvers = {
  id: (parent) => parent.id,
  exercise: async (parent, __, { userId }) => {
    const activity = await db.activity.findFirstOrThrow({
      where: { id: parent.activityId, userId: userId! },
    });
    return { type: "Exercise", value: activity };
  },
  exerciseType: (parent) =>
    db.exerciseType.findUniqueOrThrow({ where: { id: parent.exerciseTypeId } }),
  amount: async (parent) => {
    const exerciseItem = await db.exerciseItem.findUniqueOrThrow({
      where: { id: parent.id },
      include: {
        loadAmounts: {
          include: {
            loads: {
              include: {
                exerciseItemLoadAmount: true,
                exerciseLoadType: true,
              },
            },
          },
        },
      },
    });

    return exerciseItem.loadAmounts.map((loadAmount) => {
      return {
        duration:
          loadAmount.amountType === ExerciseAmountType.Repetitions &&
          loadAmount.amountRepetitions
            ? {
                __typename: "ExerciseDurationRepetitions",
                repetitions: loadAmount.amountRepetitions,
              }
            : loadAmount.amountType === ExerciseAmountType.Time &&
              loadAmount.amountDurationSeconds
            ? {
                __typename: "ExerciseDurationTime",
                durationSeconds: loadAmount.amountDurationSeconds,
              }
            : {
                __typename: "ExerciseDurationTime",
                durationSeconds: 0,
              },
        loads: loadAmount.loads.map((load) => ({
          unit: load.exerciseLoadType.unit,
          value: load.amountValue,
          type: load.exerciseLoadType,
        })),
      };
    });
    // return [

    //   {
    //     duration: {
    //       __typename: "ExerciseDurationTime",
    //       durationSeconds: 2 * 60,
    //     },
    //     load: { unit: null, value: 6 },
    //   },
    //   {
    //     duration: { __typename: "ExerciseDurationTime", durationSeconds: 45 },
    //     load: { unit: null, value: 13 },
    //   },
    //   {
    //     duration: { __typename: "ExerciseDurationTime", durationSeconds: 30 },
    //     load: { unit: null, value: 6 },
    //   },
    //   {
    //     duration: { __typename: "ExerciseDurationTime", durationSeconds: 45 },
    //     load: { unit: null, value: 13 },
    //   },
    //   {
    //     duration: { __typename: "ExerciseDurationTime", durationSeconds: 30 },
    //     load: { unit: null, value: 6 },
    //   },
    //   {
    //     duration: { __typename: "ExerciseDurationTime", durationSeconds: 45 },
    //     load: { unit: null, value: 13 },
    //   },
    //   {
    //     duration: { __typename: "ExerciseDurationTime", durationSeconds: 30 },
    //     load: { unit: null, value: 6 },
    //   },
    //   {
    //     duration: { __typename: "ExerciseDurationTime", durationSeconds: 45 },
    //     load: { unit: null, value: 13 },
    //   },
    // ];
  },
};
