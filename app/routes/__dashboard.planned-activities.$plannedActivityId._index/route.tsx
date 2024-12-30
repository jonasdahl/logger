import type { LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { DateTime } from "luxon";
import { ButtonLink } from "~/components/button-link";
import { H1 } from "~/components/headings";
import { Container } from "~/components/ui/container";
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
    <Container>
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
    </Container>
  );
}
