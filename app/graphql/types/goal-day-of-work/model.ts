import type { Goal } from "@prisma/client";

export type GoalDayOfWorkModel = Goal & { type: "DayOfWork" };
