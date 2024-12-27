import type { Goal } from "@prisma/client";

export type GoalDayOfRestModel = Goal & { type: "DayOfRest" };
