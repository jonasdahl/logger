import type { ExerciseType, Goal } from "@prisma/client";
import { useState } from "react";
import { sortBy } from "remeda";
import { ValidatedForm } from "remix-validated-form";
import { ValidatedSelectField } from "~/components/form/select";
import { SubmitButton } from "~/components/form/submit-button";
import { ValidatedInputField } from "~/components/form/validated-input-field";
import { FormStack } from "~/components/ui/form-stack";
import { goalFormValidator, GoalType } from "./schema";

export function GoalForm({
  exerciseTypes,
  goal,
}: {
  exerciseTypes: Pick<ExerciseType, "name" | "id">[];
  goal?: Pick<
    Goal,
    | "id"
    | "name"
    | "type"
    | "typeDayOfRestNumberOfDays"
    | "typeDayOfWorkNumberOfDays"
    | "typePerformExerciseTypeExerciseTypeId"
    | "typePerformExerciseTypeNumberOfDays"
  >;
}) {
  const [goalType, setGoalType] = useState<keyof typeof GoalType>(
    goal?.type || GoalType.DayOfWork
  );

  return (
    <ValidatedForm
      validator={goalFormValidator}
      method="post"
      defaultValues={{
        name: goal?.name,
        type: goalType,
        typeDayOfRestNumberOfDays: goal?.typeDayOfRestNumberOfDays ?? undefined,
        typeDayOfWorkNumberOfDays: goal?.typeDayOfWorkNumberOfDays ?? undefined,
        typePerformExerciseTypeExerciseTypeId:
          goal?.typePerformExerciseTypeExerciseTypeId ?? undefined,
        typePerformExerciseTypeNumberOfDays:
          goal?.typePerformExerciseTypeNumberOfDays ?? undefined,
      }}
    >
      <FormStack>
        <ValidatedInputField label="Beskrivning" name="name" />
        <ValidatedSelectField
          name="type"
          label="Måltyp"
          value={goalType}
          onChangeValue={(value) => setGoalType(value as keyof typeof GoalType)}
          options={[
            { value: GoalType.DayOfWork, label: "Aktivitetsdagar" },
            { value: GoalType.DayOfRest, label: "Vilodagar" },
            {
              value: GoalType.PerformExerciseType,
              label: "Utföra specifik övning",
            },
          ]}
        />
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
              options={sortBy(exerciseTypes, (e) => e.name).map(
                (exerciseType) => ({
                  value: exerciseType.id,
                  label: exerciseType.name,
                })
              )}
            />

            <ValidatedInputField
              type="number"
              name="typePerformExerciseTypeNumberOfDays"
              label="Antal dagar"
            />
          </>
        ) : null}
        <div>
          <SubmitButton>Spara</SubmitButton>
        </div>
      </FormStack>
    </ValidatedForm>
  );
}
