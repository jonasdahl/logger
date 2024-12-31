import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { withZod } from "@remix-validated-form/with-zod";
import { z } from "zod";
import { validate } from "~/components/form/validate.server";
import { Card, CardHeader, CardTitle } from "~/components/ui/card";
import { Container } from "~/components/ui/container";
import { db } from "~/db.server";
import { PlannedActivityDocument } from "~/graphql/generated/documents";
import { gqlData } from "~/graphql/graphql.server";
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
  return gqlData({
    document: PlannedActivityDocument,
    request,
    variables: { plannedActivityId: params.plannedActivityId! },
    requiredProperties: ["plannedExercise"],
  });
}

export default function PlannedActivity() {
  const { plannedExercise } = useLoaderData<typeof loader>();

  return (
    <Container className="flex flex-col gap-5">
      <div className="flex flex-col gap-3">
        {plannedExercise.exerciseItems?.map(({ id, exerciseType }) => {
          return exerciseType ? (
            <Card key={id}>
              <CardHeader>
                <CardTitle>{exerciseType.name}</CardTitle>
              </CardHeader>
            </Card>
          ) : null;
        })}
      </div>
    </Container>
  );
}
