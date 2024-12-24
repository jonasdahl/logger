import { Box } from "@chakra-ui/react";
import { GoalTimeType, GoalType } from "@prisma/client";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { withZod } from "@remix-validated-form/with-zod";
import { useState } from "react";
import { sortBy } from "remeda";
import { ValidatedForm } from "remix-validated-form";
import { z } from "zod";
import { authenticator } from "~/.server/auth.server";
import { ValidatedSelectField } from "~/components/form/select";
import { SubmitButton } from "~/components/form/submit-button";
import { validate } from "~/components/form/validate.server";
import { ValidatedInputField } from "~/components/form/validated-input-field";
import { H1 } from "~/components/headings";
import { FormStack } from "~/components/ui/form-stack";
import { db } from "~/db.server";

const validator = withZod(
  z.object({
    name: z.string().min(1, "Beskrivning måste anges"),
    type: z.nativeEnum(GoalType),
    typeDayOfRestNumberOfDays: z.coerce.number().optional(),
    typeDayOfWorkNumberOfDays: z.coerce.number().optional(),
    typePerformExerciseTypeExerciseTypeId: z.string().optional(),
    typePerformExerciseTypeNumberOfDays: z.coerce.number().optional(),
  })
);

export async function action({ request }: ActionFunctionArgs) {
  const url = new URL(request.url);
  const { id: userId } = await authenticator.isAuthenticated(request, {
    failureRedirect: "/",
  });
  const data = await validate({ request, validator });

  await db.goal.create({
    data: {
      userId,
      name: data.name,
      type: data.type,
      typeDayOfRestNumberOfDays: data.typeDayOfRestNumberOfDays ?? undefined,
      typeDayOfWorkNumberOfDays: data.typeDayOfWorkNumberOfDays ?? undefined,
      typePerformExerciseTypeNumberOfDays:
        data.typePerformExerciseTypeNumberOfDays ?? undefined,
      typePerformExerciseTypeExerciseTypeId:
        data.typePerformExerciseTypeExerciseTypeId ?? undefined,
      timeType: GoalTimeType.EveryRollingNumberOfDays,
      timeTypeEveryRollingNumberOfDaysAmount: 7,
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
  return json({ exerciseTypes });
}

export default function CreateTest() {
  const { exerciseTypes } = useLoaderData<typeof loader>();
  const [goalType, setGoalType] = useState<GoalType>(GoalType.DayOfWork);

  return (
    <div className="flex flex-col gap-5 py-6 container max-w-screen-md mx-auto px-4">
      <H1>Skapa veckomål</H1>
      <ValidatedForm validator={validator} method="post">
        <FormStack>
          <ValidatedInputField label="Beskrivning" name="name" />
          <ValidatedSelectField
            name="type"
            label="Måltyp"
            value={goalType}
            onChange={({ target: { value } }) => setGoalType(value as GoalType)}
          >
            <option value={GoalType.DayOfWork}>Aktivitetsdagar</option>
            <option value={GoalType.DayOfRest}>Vilodagar</option>
            <option value={GoalType.PerformExerciseType}>
              Utföra specifik övning
            </option>
          </ValidatedSelectField>
          {goalType === GoalType.DayOfRest ? (
            <ValidatedInputField
              type="number"
              name="typeDayOfRestNumberOfDays"
              label="Antal dagar"
            />
          ) : null}
          {goalType === GoalType.DayOfWork ? (
            <ValidatedInputField
              type="number"
              name="typeDayOfWorkNumberOfDays"
              label="Antal dagar"
            />
          ) : null}
          {goalType === GoalType.PerformExerciseType ? (
            <>
              <ValidatedSelectField
                name="typePerformExerciseTypeExerciseTypeId"
                label="Övning"
              >
                {sortBy(exerciseTypes, (e) => e.name).map((exerciseType) => (
                  <option key={exerciseType.id} value={exerciseType.id}>
                    {exerciseType.name}
                  </option>
                ))}
              </ValidatedSelectField>

              <ValidatedInputField
                type="number"
                name="typePerformExerciseTypeNumberOfDays"
                label="Antal dagar"
              />
            </>
          ) : null}
          <Box>
            <SubmitButton>Skapa</SubmitButton>
          </Box>
        </FormStack>
      </ValidatedForm>
    </div>
  );
}
