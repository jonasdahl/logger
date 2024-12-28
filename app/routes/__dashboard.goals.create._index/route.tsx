import { GoalTimeType } from "@prisma/client";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { authenticator } from "~/.server/auth.server";
import { validate } from "~/components/form/validate.server";
import { H1 } from "~/components/headings";
import { db } from "~/db.server";
import { GoalForm } from "~/forms/goal-form/goal-form";
import { goalFormValidator } from "~/forms/goal-form/schema";

export async function action({ request }: ActionFunctionArgs) {
  const url = new URL(request.url);
  const { id: userId } = await authenticator.isAuthenticated(request, {
    failureRedirect: "/",
  });
  const data = await validate({ request, validator: goalFormValidator });

  await db.goal.create({
    data: {
      userId,
      name: data.name,
      type: data.type,
      typeDayOfRestNumberOfDays:
        "typeDayOfRestNumberOfDays" in data
          ? data.typeDayOfRestNumberOfDays
          : undefined,
      typeDayOfWorkNumberOfDays:
        "typeDayOfWorkNumberOfDays" in data
          ? data.typeDayOfWorkNumberOfDays
          : undefined,
      typePerformExerciseTypeNumberOfDays:
        "typePerformExerciseTypeNumberOfDays" in data
          ? data.typePerformExerciseTypeNumberOfDays
          : undefined,
      typePerformExerciseTypeExerciseTypeId:
        "typePerformExerciseTypeExerciseTypeId" in data
          ? data.typePerformExerciseTypeExerciseTypeId
          : undefined,
      timeType: GoalTimeType.EveryCalendarWeek,
    },
  });

  return redirect(url.searchParams.get("redirectTo") ?? "/");
}

export async function loader({ request }: LoaderFunctionArgs) {
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  });
  const exerciseTypes = await db.exerciseType.findMany({
    where: { userId: user.id },
  });
  return { exerciseTypes };
}

export default function CreateTest() {
  const { exerciseTypes } = useLoaderData<typeof loader>();

  return (
    <div className="flex flex-col gap-5 py-6 container max-w-screen-md mx-auto px-4">
      <H1>Skapa veckomål</H1>
      <GoalForm exerciseTypes={exerciseTypes} />
    </div>
  );
}
