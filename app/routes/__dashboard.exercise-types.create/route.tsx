import type { ActionFunctionArgs } from "@remix-run/node";
import { H1 } from "~/components/headings";
import { getExerciseTypeFormAction } from "~/forms/exercise-type-form/action.server";
import { ExerciseTypeForm } from "~/forms/exercise-type-form/exercise-type-form";

export async function action(args: ActionFunctionArgs) {
  return getExerciseTypeFormAction()(args);
}

export default function Activity() {
  return (
    <div className="container mx-auto px-3 max-w-screen-md py-5 flex flex-col gap-3">
      <H1>Ny övningstyp</H1>
      <ExerciseTypeForm />
    </div>
  );
}
