import { DateTime, Interval } from "luxon";
import { db } from "~/db.server";
import { type ExerciseTypeHistoryResolvers } from "~/graphql/generated/graphql";

export const exerciseTypeHistoryResolvers: ExerciseTypeHistoryResolvers = {
  name: (parent) => parent.name,
  dayAmounts: async (parent) => {
    const res = await db.exerciseType.findUnique({
      where: { id: parent.id },
      include: {
        exerciseItems: {
          include: {
            activity: true,
            loadAmounts: {
              include: { loads: { include: { exerciseLoadType: true } } },
            },
          },
        },
      },
    });

    const loadAmounts = res!.exerciseItems.flatMap((item) =>
      item.loadAmounts.map((loadAmount) => ({
        loadAmount,
        activity: item.activity,
      }))
    );

    const activityTimestamps = loadAmounts?.map((amount) =>
      DateTime.fromJSDate(amount.activity.time).toMillis()
    );
    const start = Math.min(...activityTimestamps);
    const end = Math.max(...activityTimestamps);
    const interval = Interval.fromDateTimes(
      DateTime.fromMillis(start).startOf("day"),
      DateTime.fromMillis(end).endOf("day")
    );

    return interval.splitBy({ day: 1 }).map((day) => ({
      dayStart: day.start!,
      exerciseType: parent,
      loadAmounts: loadAmounts
        .filter((amount) =>
          day.contains(DateTime.fromJSDate(amount.activity.time))
        )
        .map(({ loadAmount }) => loadAmount),
    }));
  },
};
