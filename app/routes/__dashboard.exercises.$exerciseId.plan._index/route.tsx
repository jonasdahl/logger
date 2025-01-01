import type { LoaderFunctionArgs } from "@remix-run/node";
import { authenticator } from "~/.server/auth.server";

import { useLoaderData } from "@remix-run/react";
import { z } from "zod";
import { ButtonLink } from "~/components/button-link";
import { Card, CardHeader, CardTitle } from "~/components/ui/card";
import { Container } from "~/components/ui/container";
import { ExercisePlanDocument } from "~/graphql/generated/documents";
import { gqlData } from "~/graphql/graphql.server";

export async function loader({ request, params }: LoaderFunctionArgs) {
  await authenticator.isAuthenticated(request, { failureRedirect: "/" });
  const { exerciseId } = z.object({ exerciseId: z.string() }).parse(params);

  return gqlData({
    document: ExercisePlanDocument,
    request,
    variables: { exerciseId },
  });
}

export default function Activity() {
  const data = useLoaderData<typeof loader>();

  return (
    <Container className="pb-0">
      <div className="flex flex-col gap-2">
        {data?.exercise?.fromPlannedActivity?.exerciseItems.map((item) => {
          return (
            <Card
              key={item.exerciseType?.id}
              className="flex flex-row w-full px-3 py-2 pr-2"
            >
              <CardHeader className="flex-1 py-2">
                <CardTitle>{item.exerciseType?.name}</CardTitle>
              </CardHeader>
              <div>
                <ButtonLink
                  to={`/exercises/${data.exercise?.id}/items/create?createdExerciseTypeId=${item.exerciseType?.id}`}
                  variant="secondary"
                  size="sm"
                >
                  Lägg till
                </ButtonLink>
              </div>
            </Card>
          );
        })}
      </div>
    </Container>
  );
}
