import {
  Box,
  Button,
  Checkbox,
  Container,
  HStack,
  Heading,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Spacer,
  Stack,
  Wrap,
  WrapItem,
} from "@chakra-ui/react";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { authenticator } from "~/.server/auth.server";
import { HiddenReturnToInput } from "~/services/return-to";

import {
  faArrowDown,
  faArrowUp,
  faChartArea,
  faCopy,
  faEllipsisVertical,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Form, Link, useLoaderData, useParams } from "@remix-run/react";
import { DateTime, Duration } from "luxon";
import { useState } from "react";
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
      _action: z.literal("duplicateItems"),
      exerciseItemIds: z.string().transform((s) => s.split(",")),
    }),
    z.object({
      _action: z.literal("deleteItem"),
      exerciseItemId: z.string(),
    }),
    z.object({
      _action: z.literal("setOrder"),
      order: z
        .string()
        .transform((s) => z.array(z.string()).parse(JSON.parse(s))),
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
            amountDurationMilliSeconds: loadAmount.amountDurationMilliSeconds,
            amountRepetitions: loadAmount.amountRepetitions,
            amountLevelId: loadAmount.amountLevelId,
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
  } else if (data._action === "duplicateItems") {
    const exerciseItems = await db.exerciseItem.findMany({
      where: {
        id: { in: data.exerciseItemIds },
        deletedAt: null,
        activity: { deletedAt: null },
      },
      include: { activity: true, loadAmounts: { include: { loads: {} } } },
      orderBy: { order: "asc" },
    });
    if (
      exerciseItems.some(
        (exerciseItem) => exerciseItem.activity.userId !== userId
      )
    ) {
      throw new Error("Unauthorized");
    }
    const activityId = exerciseItems[0]?.activityId;
    if (!activityId) {
      throw new Error("No activityId");
    }

    const allOtherItems = await db.exerciseItem.findMany({
      where: { activityId },
    });

    for (let i = 0; i < exerciseItems.length; i++) {
      const exerciseItem = exerciseItems[i]!;
      await db.exerciseItem.create({
        data: {
          order: Math.max(0, ...allOtherItems.map((i) => i.order)) + 1 + i,
          activityId: exerciseItem.activityId,
          exerciseTypeId: exerciseItem.exerciseTypeId,
          loadAmounts: {
            create: exerciseItem.loadAmounts.map((loadAmount) => ({
              amountType: loadAmount.amountType,
              amountDurationMilliSeconds: loadAmount.amountDurationMilliSeconds,
              amountRepetitions: loadAmount.amountRepetitions,
              amountLevelId: loadAmount.amountLevelId,
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
  } else if (data._action === "setOrder") {
    const exerciseItems = await db.exerciseItem.findMany({
      where: {
        id: { in: data.order },
      },
      include: { activity: true },
      orderBy: { order: "asc" },
    });
    if (
      exerciseItems.some(
        (exerciseItem) => exerciseItem.activity.userId !== userId
      )
    ) {
      throw new Error("Unauthorized");
    }

    for (const [i, id] of data.order.entries()) {
      await db.exerciseItem.update({
        where: { id },
        data: { order: i },
      });
    }
  }

  return redirect(data.returnTo ?? `/exercises/${params.exerciseId}`);
}

export default function Activity() {
  const { exerciseId } = useParams();
  const data = useLoaderData<typeof loader>();
  const [checkedExerciseItemIds, setCheckedExerciseItemIds] = useState<
    string[]
  >([]);
  const selectedExerciseItemIds = checkedExerciseItemIds.filter((x) =>
    data?.exercise?.items.edges.some((edge) => edge.cursor === x)
  );
  const start = data?.exercise?.start;

  const move = (id: string, diff: number) => {
    const currentList = data?.exercise?.items.edges.map((e) => e.cursor) ?? [];
    const currentIndex = currentList.indexOf(id);
    if (currentIndex < 0) {
      return currentList;
    }
    const futureIndex = currentIndex + diff;
    if (futureIndex < 0 || futureIndex >= currentList.length) {
      return currentList;
    }
    const newList = [...currentList.filter((_, i) => i !== currentIndex)];
    newList.splice(futureIndex, 0, id);
    return newList;
  };

  return (
    <Container py={5} maxW="container.md">
      <HiddenReturnToInput />
      <Stack spacing={5}>
        <Wrap align="center">
          <WrapItem>
            <Heading as="h1">Träning</Heading>
          </WrapItem>
          <Spacer />
          {start ? (
            <WrapItem>
              <ButtonLink
                variant="link"
                to={`/days/${DateTime.fromISO(start).toFormat("yyyy-MM-dd")}`}
              >
                Visa dag
              </ButtonLink>
            </WrapItem>
          ) : null}
        </Wrap>

        <HStack height={10}>
          <Heading size="md" as="h2">
            Övningar
          </Heading>
          <Spacer />
          {selectedExerciseItemIds.length > 0 ? (
            <Box>
              <Form method="post">
                <input type="hidden" name="_action" value="duplicateItems" />
                <HiddenReturnToInput />
                <input
                  type="hidden"
                  name="exerciseItemIds"
                  value={selectedExerciseItemIds.join(",")}
                />
                <Button type="submit" size="xs">
                  Duplicera valda
                </Button>
              </Form>
            </Box>
          ) : null}
        </HStack>
        <Stack spacing={2}>
          {data?.exercise?.items.edges.map((edge) => {
            if (!edge.node) {
              return null;
            }
            return (
              <HStack key={edge.cursor}>
                <Box>
                  <Checkbox
                    onChange={(e) => {
                      if (e.target.checked) {
                        setCheckedExerciseItemIds([
                          ...checkedExerciseItemIds,
                          edge.cursor,
                        ]);
                      } else {
                        setCheckedExerciseItemIds(
                          checkedExerciseItemIds.filter(
                            (id) => id !== edge.cursor
                          )
                        );
                      }
                    }}
                    isChecked={checkedExerciseItemIds.includes(edge.cursor)}
                  >
                    {edge.node?.exerciseType.name}
                  </Checkbox>
                </Box>

                <Stack>
                  {edge.node.amount.map((set) => {
                    const loads = set.loads.length
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
                    } else if (
                      set.duration.__typename === "ExerciseDurationLevel"
                    ) {
                      return <Box>{set.duration.levelType.name}</Box>;
                    } else {
                      const duration = Duration.fromObject({
                        hours: 0,
                        minutes: 0,
                        seconds: set.duration.durationSeconds,
                      }).normalize();
                      const timeString =
                        duration.toMillis() > 60 * 1000
                          ? duration.toFormat("m'm' s's'")
                          : duration.toMillis() < 10_000
                          ? duration.toFormat("s.S's'")
                          : duration.toFormat("s's'");
                      return <Box>{`${timeString}${loads}`}</Box>;
                    }
                  })}
                </Stack>
                <Spacer />
                <Box>
                  <Form method="post">
                    <input
                      type="hidden"
                      name="order"
                      value={JSON.stringify(move(edge.cursor, 1))}
                    />
                    <input type="hidden" name="_action" value="setOrder" />
                    <IconButton
                      type="submit"
                      aria-label="Flytta ner"
                      icon={<FontAwesomeIcon icon={faArrowDown} />}
                      size="xs"
                    />
                  </Form>
                </Box>
                <Box>
                  <Form method="post">
                    <input
                      type="hidden"
                      name="order"
                      value={JSON.stringify(move(edge.cursor, -1))}
                    />
                    <input type="hidden" name="_action" value="setOrder" />
                    <IconButton
                      type="submit"
                      aria-label="Flytta upp"
                      icon={<FontAwesomeIcon icon={faArrowUp} />}
                      size="xs"
                    />
                  </Form>
                </Box>
                <Box>
                  <Menu>
                    <MenuButton
                      as={IconButton}
                      icon={<FontAwesomeIcon icon={faEllipsisVertical} />}
                      size="xs"
                    />
                    <MenuList>
                      <MenuItem
                        as={Link}
                        to={`/stats/exercise-types/${edge.node.exerciseType.id}`}
                        icon={<FontAwesomeIcon icon={faChartArea} />}
                      >
                        Statistik
                      </MenuItem>
                      <Form method="post">
                        <input
                          type="hidden"
                          name="exerciseItemId"
                          value={edge.node?.id}
                        />
                        <input
                          type="hidden"
                          name="_action"
                          value="duplicateItem"
                        />
                        <HiddenReturnToInput />
                        <MenuItem
                          type="submit"
                          icon={<FontAwesomeIcon icon={faCopy} />}
                        >
                          Duplicera
                        </MenuItem>
                      </Form>
                      <Form method="post">
                        <input
                          type="hidden"
                          name="exerciseItemId"
                          value={edge.node?.id}
                        />
                        <input
                          type="hidden"
                          name="_action"
                          value="deleteItem"
                        />
                        <HiddenReturnToInput />
                        <MenuItem
                          type="submit"
                          icon={<FontAwesomeIcon icon={faTrash} />}
                          color="red.500"
                        >
                          Radera
                        </MenuItem>
                      </Form>
                    </MenuList>
                  </Menu>
                </Box>
              </HStack>
            );
          })}
        </Stack>
        <Box>
          <ButtonLink
            to={`/exercises/${exerciseId}/items/create`}
            colorScheme="green"
          >
            Lägg till övning
          </ButtonLink>
        </Box>
      </Stack>
    </Container>
  );
}
