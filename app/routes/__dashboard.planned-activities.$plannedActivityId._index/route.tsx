import type { LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { withZod } from "@remix-validated-form/with-zod";
import { DateTime } from "luxon";
import { ValidatedForm } from "remix-validated-form";
import { z } from "zod";
import { ButtonLink } from "~/components/button-link";
import { ValidatedComboboxField } from "~/components/form/validated-combobox-field";
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
import { PlannedActivityDocument } from "~/graphql/generated/documents";
import { gql } from "~/graphql/graphql.server";

export async function loader({ request, params }: LoaderFunctionArgs) {
  return gql({
    document: PlannedActivityDocument,
    request,
    variables: { plannedActivityId: params.plannedActivityId! },
  });
}

export default function PlannedActivity() {
  const { data } = useLoaderData<typeof loader>();

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
        <div className="flex flex-row gap-2">
          <Popover>
            <PopoverTrigger>
              <Button variant="outline">Ny övning</Button>
            </PopoverTrigger>
            <PopoverContent>
              <ValidatedForm validator={withZod(z.object({}))} method="post">
                <FormStack>
                  <ValidatedComboboxField
                    label="Övning"
                    name="exerciseTypeId"
                    options={[]}
                  />
                </FormStack>
              </ValidatedForm>
            </PopoverContent>
          </Popover>
          <Button variant="outline">Ny grupp</Button>
        </div>
      </div>
    </Container>
  );
}
