import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import { authenticator } from "~/.server/auth.server";
import { validate } from "~/components/form/validate.server";
import { H1 } from "~/components/headings";
import { Button } from "~/components/ui/button";
import { TitleRow } from "~/components/ui/title-row";
import { db } from "~/db.server";
import { GoalForm } from "~/forms/goal-form/goal-form";
import { goalFormValidator } from "~/forms/goal-form/schema";

export async function action({ request, params }: ActionFunctionArgs) {
  const url = new URL(request.url);
  const { id: userId } = await authenticator.isAuthenticated(request, {
    failureRedirect: "/",
  });
  const data = await validate({ request, validator: goalFormValidator });

  const previousGoal = await db.goal.findFirstOrThrow({
    where: { id: params.goalId!, userId },
  });

  if (request.method === "DELETE") {
    await db.goal.delete({ where: { id: previousGoal.id } });
    return redirect(url.searchParams.get("redirectTo") ?? "/");
  }

  await db.goal.update({
    where: { id: previousGoal.id },
    data: {
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
    },
  });

  return redirect(url.searchParams.get("redirectTo") ?? "/");
}

export async function loader({ request, params }: LoaderFunctionArgs) {
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  });
  const exerciseTypes = await db.exerciseType.findMany({
    where: { userId: user.id },
  });
  const goal = await db.goal.findFirstOrThrow({
    where: { id: params.goalId!, userId: user.id },
  });
  return { exerciseTypes, goal };
}

export default function CreateTest() {
  const { exerciseTypes, goal } = useLoaderData<typeof loader>();

  return (
    <div className="flex flex-col gap-5 py-6 container max-w-screen-md mx-auto px-4">
      <TitleRow
        actions={
          <Form method="post" action={`/goals/${goal.id}/delete`}>
            <Button
              type="submit"
              variant="outline"
              size="sm"
              className="text-red-500"
            >
              <FontAwesomeIcon icon={faTrash} />
            </Button>
          </Form>
        }
      >
        <H1>Ändra mål</H1>
      </TitleRow>
      <GoalForm exerciseTypes={exerciseTypes} goal={goal} />
    </div>
  );
}
