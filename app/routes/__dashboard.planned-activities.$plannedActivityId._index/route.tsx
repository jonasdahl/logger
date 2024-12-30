import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { withZod } from "@remix-validated-form/with-zod";
import { DateTime } from "luxon";
import { useState } from "react";
import { ValidatedForm } from "remix-validated-form";
import { z } from "zod";
import { ButtonLink } from "~/components/button-link";
import { ValidatedSelectField } from "~/components/form/select";
import { SubmitButton } from "~/components/form/submit-button";
import { validate } from "~/components/form/validate.server";
import { ValidatedInputField } from "~/components/form/validated-input-field";
import { H1, H2 } from "~/components/headings";
import { Button } from "~/components/ui/button";
import { Container } from "~/components/ui/container";
import { FormStack } from "~/components/ui/form-stack";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { TitleRow } from "~/components/ui/title-row";
import { db } from "~/db.server";
import { PlannedActivityDocument } from "~/graphql/generated/documents";
import { gql } from "~/graphql/graphql.server";
import { redirectBack } from "~/lib/redirect-back";

const validator = withZod(
  z.object({
    _action: z.literal("exercise"),
    exerciseTypeId: z.string(),
    parentItemId: z.string().optional(),
  })
);

export async function action({ request, params }: ActionFunctionArgs) {
  const data = await validate({ request, validator });
  const plannedActivityId = z.string().parse(params.plannedActivityId);

  const plannedExerciseItems = await db.plannedExerciseItem.findMany({
    where: { plannedActivityId },
    orderBy: { order: "asc" },
  });

  if (data._action === "exercise") {
    await db.plannedExerciseItem.create({
      data: {
        plannedActivityId,
        order: Math.max(0, ...plannedExerciseItems.map((e) => e.order)) + 1,
        type: "Exercise",
        parentItemId: data.parentItemId || null,
        typeExerciseExerciseTypeId: data.exerciseTypeId,
      },
    });
  }

  return redirectBack("/", request);
}

export async function loader({ request, params }: LoaderFunctionArgs) {
  return gql({
    document: PlannedActivityDocument,
    request,
    variables: { plannedActivityId: params.plannedActivityId! },
  });
}

export default function PlannedActivity() {
  const { data, errors } = useLoaderData<typeof loader>();

  console.log(data, errors);

  const plannedExercise = data?.plannedExercise;

  if (!plannedExercise) {
    throw new Error("Planned exercise not found");
  }

  return (
    <Container className="flex flex-col gap-5">
      <TitleRow
        actions={
          <ButtonLink
            to={`/activities/create?from=${
              plannedExercise.id
            }&date=${DateTime.fromISO(plannedExercise.start).toFormat(
              "yyyy-MM-dd"
            )}`}
          >
            Starta nu
          </ButtonLink>
        }
      >
        <H1>Planerad aktivitet</H1>
      </TitleRow>

      <div className="flex flex-col gap-3">
        <H2>Övningar</H2>

        {plannedExercise.exerciseItems?.map(({ id, exerciseType }) => {
          return exerciseType ? <div key={id}>{exerciseType.name}</div> : null;
        })}

        <div className="flex flex-row gap-2">
          <NewExerciseButton />

          <Popover>
            <PopoverTrigger>
              <Button variant="outline">Ny grupp</Button>
            </PopoverTrigger>
            <PopoverContent>
              <ValidatedForm validator={withZod(z.object({}))} method="post">
                <FormStack>
                  <ValidatedInputField label="Namn" name="name" />
                  <div>
                    <SubmitButton>Skapa</SubmitButton>
                  </div>
                </FormStack>
              </ValidatedForm>
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </Container>
  );
}

function NewExerciseButton() {
  const { data } = useLoaderData<typeof loader>();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger>
        <Button variant="outline">Ny övning</Button>
      </PopoverTrigger>
      <PopoverContent>
        <ValidatedForm
          validator={validator}
          method="post"
          onSubmit={() => setIsOpen(false)}
        >
          <input type="hidden" name="_action" value="exercise" />
          <FormStack>
            <ValidatedSelectField
              label="Övning"
              name="exerciseTypeId"
              options={
                data?.exerciseTypes?.edges?.map((et) => ({
                  value: et.node?.id ?? "-",
                  label: et.node?.name ?? "-",
                })) || []
              }
            />
            <SubmitButton>Skapa</SubmitButton>
          </FormStack>
        </ValidatedForm>
      </PopoverContent>
    </Popover>
  );
}
