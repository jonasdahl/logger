import { ExerciseAmountType } from "@prisma/client";
import type { ActionFunctionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { authenticator } from "~/.server/auth.server";
import { validate } from "~/components/form/validate.server";
import { db } from "~/db.server";
import { addSearchParamToPath } from "~/utils/add-search-param-to-path";
import { exerciseTypeValidator } from "./schema";

export const getExerciseTypeFormAction =
  () =>
  async ({ request }: ActionFunctionArgs) => {
    const { id: userId } = await authenticator.isAuthenticated(request, {
      failureRedirect: "/",
    });

    const data = await validate({ request, validator: exerciseTypeValidator });

    const exerciseType = await db.exerciseType.create({
      data: {
        name: data.name,
        userId,
        defaultExerciseAmountType:
          data.defaultAmountType === "time"
            ? ExerciseAmountType.Time
            : data.defaultAmountType === "levels"
            ? ExerciseAmountType.Levels
            : data.defaultAmountType === "repetitions"
            ? ExerciseAmountType.Repetitions
            : undefined,
        loads: {
          create: data.loads?.map((load) => ({
            name: load.name,
            unit: load.unit || undefined,
          })),
        },
        levels: {
          create: data.levels?.map((load, i) => ({
            name: load,
            order: i,
          })),
        },
      },
    });

    return redirect(
      addSearchParamToPath(
        data.returnTo ?? "/exercise-types",
        "createdExerciseTypeId",
        exerciseType.id
      )
    );
  };
