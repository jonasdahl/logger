import {
  Box,
  Container,
  HStack,
  Heading,
  IconButton,
  Spacer,
  Stack,
} from "@chakra-ui/react";
import { ActionFunctionArgs, redirect } from "@remix-run/node";
import { authenticator } from "~/auth.server";
import { HiddenReturnToInput } from "~/services/return-to";

import { faCopy, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { LoaderFunctionArgs, json } from "@remix-run/node";
import { Form, useLoaderData, useParams } from "@remix-run/react";
import { DateTime, Duration } from "luxon";
import { z } from "zod";
import { ButtonLink } from "~/components/button-link";
import { db } from "~/db.server";
import { ExerciseDetailsDocument } from "~/graphql/generated/documents";
import { gql } from "~/graphql/graphql.server";

const postSchema = z.intersection(
  z.object({ returnTo: z.string().optional() }),
  z.union([
    z.object({
      _action: z.literal("duplicateItem"),
      exerciseItemId: z.string(),
    }),
    z.object({
      _action: z.literal("deleteItem"),
      exerciseItemId: z.string(),
    }),
  ])
);

export async function loader({ request, params }: LoaderFunctionArgs) {
  const { id: userId } = await authenticator.isAuthenticated(request, {
    failureRedirect: "/",
  });
  const { exerciseId } = await z
    .object({ exerciseId: z.string() })
    .parse(params);

  const res = await gql({
    document: ExerciseDetailsDocument,
    request,
    variables: { exerciseId },
  });

  return json(res.data);
}

export async function action({ request, params }: ActionFunctionArgs) {
  const formData = await request.formData();
  const data = postSchema.parse(Object.fromEntries(formData.entries()));
  const { id: userId } = await authenticator.isAuthenticated(request, {
    failureRedirect: "/",
  });

  if (data._action === "deleteItem") {
    const exerciseItem = await db.exerciseItem.findFirstOrThrow({
      where: {
        id: data.exerciseItemId,
        deletedAt: null,
        activity: { deletedAt: null },
      },
      include: { activity: true },
    });
    if (exerciseItem.activity.userId !== userId) {
      throw new Error("Unauthorized");
    }
    await db.exerciseItem.update({
      where: { id: data.exerciseItemId },
      data: { deletedAt: DateTime.now().toJSDate() },
    });
  } else if (data._action === "duplicateItem") {
    const exerciseItem = await db.exerciseItem.findFirstOrThrow({
      where: {
        id: data.exerciseItemId,
        deletedAt: null,
        activity: { deletedAt: null },
      },
      include: { activity: true, loadAmounts: { include: { loads: {} } } },
    });
    if (exerciseItem.activity.userId !== userId) {
      throw new Error("Unauthorized");
    }

    const allOtherItems = await db.exerciseItem.findMany({
      where: { activityId: exerciseItem.activityId },
    });

    await db.exerciseItem.create({
      data: {
        order: Math.max(0, ...allOtherItems.map((i) => i.order)) + 1,
        activityId: exerciseItem.activityId,
        exerciseTypeId: exerciseItem.exerciseTypeId,
        loadAmounts: {
          create: exerciseItem.loadAmounts.map((loadAmount) => ({
            amountType: loadAmount.amountType,
            amountDurationSeconds: loadAmount.amountDurationSeconds,
            amountRepetitions: loadAmount.amountRepetitions,
            loads: {
              create: loadAmount.loads.map((load) => ({
                amountValue: load.amountValue,
                exerciseLoadTypeId: load.exerciseLoadTypeId,
              })),
            },
          })),
        },
      },
    });
  }

  return redirect(data.returnTo ?? "/exercises/" + params.exerciseId);
}

export default function Activity() {
  const { exerciseId } = useParams();
  const data = useLoaderData<typeof loader>();

  return (
    <Container py={5}>
      <HiddenReturnToInput />
      <Stack spacing={5}>
        <Heading as="h1">Träning</Heading>
        <Heading size="md" as="h2">
          Övningar
        </Heading>
        <Stack spacing={2}>
          {data?.exercise?.items.edges.map((edge) => {
            if (!edge.node) {
              return null;
            }
            return (
              <HStack key={edge.cursor} alignItems="flex-start">
                <Stack>
                  {edge.node.amount.map((set) => {
                    const loads = set.loads
                      ? ` (${set.loads
                          .map(
                            (load) =>
                              `${
                                set.loads.length > 1
                                  ? `${load.type.name}: `
                                  : ""
                              }${load.value}${load.unit ? ` ${load.unit}` : ""}`
                          )
                          .join(", ")})`
                      : "";

                    if (
                      set.duration.__typename === "ExerciseDurationRepetitions"
                    ) {
                      return (
                        <Box>{`${set.duration.repetitions}st${loads}`}</Box>
                      );
                    } else {
                      const duration = Duration.fromObject({
                        hours: 0,
                        minutes: 0,
                        seconds: set.duration.durationSeconds,
                      }).normalize();
                      const timeString =
                        duration.toMillis() > 60 * 1000
                          ? duration.toFormat("m'm' s's'")
                          : duration.toFormat("s's'");
                      return <Box>{`${timeString}${loads}`}</Box>;
                    }
                  })}
                </Stack>
                <Box>{edge.node?.exerciseType.name}</Box>
                <Spacer />
                <Box>
                  <Form method="post">
                    <input
                      type="hidden"
                      name="exerciseItemId"
                      value={edge.node?.id}
                    />
                    <input type="hidden" name="_action" value="duplicateItem" />
                    <HiddenReturnToInput />
                    <IconButton
                      size="xs"
                      aria-label="Duplicate"
                      type="submit"
                      icon={<FontAwesomeIcon icon={faCopy} />}
                      colorScheme="blue"
                      variant="outline"
                    />
                  </Form>
                </Box>
                <Box>
                  <Form method="post">
                    <input
                      type="hidden"
                      name="exerciseItemId"
                      value={edge.node?.id}
                    />
                    <input type="hidden" name="_action" value="deleteItem" />
                    <HiddenReturnToInput />
                    <IconButton
                      size="xs"
                      aria-label="Delete"
                      type="submit"
                      icon={<FontAwesomeIcon icon={faTrash} />}
                      colorScheme="red"
                      variant="outline"
                    />
                  </Form>
                </Box>
              </HStack>
            );
          })}
        </Stack>
        <ButtonLink to={`/exercises/${exerciseId}/items/create`}>
          Lägg till
        </ButtonLink>
      </Stack>
    </Container>
  );
}
