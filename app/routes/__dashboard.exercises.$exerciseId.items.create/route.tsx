import {
  Box,
  Container,
  FormControl,
  FormLabel,
  HStack,
  Heading,
  Input,
  InputGroup,
  InputRightAddon,
  Spacer,
  Stack,
} from "@chakra-ui/react";
import { authenticator } from "~/auth.server";
import { HiddenReturnToInput } from "~/services/return-to";

import { ExerciseAmountType } from "@prisma/client";
import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  json,
  redirect,
} from "@remix-run/node";
import { useLoaderData, useParams, useSearchParams } from "@remix-run/react";
import { withZod } from "@remix-validated-form/with-zod";
import { useState } from "react";
import { ValidatedForm } from "remix-validated-form";
import { z } from "zod";
import { Select } from "~/components/form/select";
import { SubmitButton } from "~/components/form/submit-button";
import { Link } from "~/components/link";
import { db } from "~/db.server";
import {
  AmountType,
  CreateExerciseItemDocument,
} from "~/graphql/generated/documents";
import { gql } from "~/graphql/graphql.server";
import { formDataToObject } from "~/utils/form-data-to-object";

const schema = z.intersection(
  z.object({
    exerciseTypeId: z.string(),
    returnTo: z.string().optional(),
    loadAmount: z.array(
      z.object({
        amountValue: z.coerce.number(),
        loadUnit: z.string(),
        loadTypeId: z.string(),
      })
    ),
  }),

  z.union([
    z
      .object({
        amountType: z.literal("time"),
        durationHours: z.coerce.number().optional(),
        durationMinutes: z.coerce.number().optional(),
        durationSeconds: z.coerce.number().optional(),
      })
      .transform((v) => ({
        amountType: "time" as const,
        durationSeconds:
          (v.durationSeconds ?? 0) +
          (v.durationMinutes ?? 0) * 60 +
          (v.durationHours ?? 0) * 60 * 60,
      })),
    z.object({
      amountType: z.literal("repetitions"),
      repetitions: z.coerce.number(),
    }),
  ])
);
const validator = withZod(schema);

export async function loader({ request, params }: LoaderFunctionArgs) {
  const { id: userId } = await authenticator.isAuthenticated(request, {
    failureRedirect: "/",
  });

  const { data } = await gql({
    document: CreateExerciseItemDocument,
    request,
    variables: {},
  });

  return json(data);
}

export async function action({ request, params }: ActionFunctionArgs) {
  const { id: userId } = await authenticator.isAuthenticated(request, {
    failureRedirect: "/",
  });
  const { exerciseId } = await z
    .object({ exerciseId: z.string() })
    .parse(params);

  const formData = await request.formData();
  const rawData = formDataToObject(formData);
  const data = schema.parse(rawData);

  const activity = await db.activity.findFirstOrThrow({
    where: { id: exerciseId, userId },
    include: { exerciseItems: true },
  });

  await db.exerciseItem.create({
    data: {
      order: Math.max(0, ...activity.exerciseItems.map((i) => i.order)) + 1,
      activityId: activity.id,
      exerciseTypeId: data.exerciseTypeId,
      loadAmounts: {
        create: {
          amountType:
            data.amountType === "repetitions"
              ? ExerciseAmountType.Repetitions
              : ExerciseAmountType.Time,
          amountDurationSeconds:
            data.amountType === "time" ? data.durationSeconds : undefined,
          amountRepetitions:
            data.amountType === "repetitions" ? data.repetitions : undefined,
          loads: {
            create: data.loadAmount.map(
              ({ amountValue, loadTypeId, loadUnit }) => ({
                amountValue,
                exerciseLoadTypeId: loadTypeId,
              })
            ),
          },
        },
      },
    },
  });

  return redirect(data.returnTo ?? "/exercises/" + activity.id);
}

export default function Activity() {
  const { exerciseId } = useParams();
  const data = useLoaderData<typeof loader>();
  const [searchParams] = useSearchParams();
  const defaultExerciseTypeId =
    searchParams.get("createdExerciseTypeId") ?? undefined;
  const [exerciseTypeId, setExerciseTypeId] = useState(defaultExerciseTypeId);
  const exerciseType = data?.exerciseTypes.edges.find(
    (e) => e.node?.id === exerciseTypeId
  )?.node;

  return (
    <Container py={5} maxW="container.xl">
      <HiddenReturnToInput />
      <ValidatedForm method="post" validator={validator}>
        <Stack spacing={5}>
          <Heading as="h1">Ny övning</Heading>
          <Stack spacing={1}>
            <Select
              label="Övning"
              name="exerciseTypeId"
              defaultValue={defaultExerciseTypeId}
              onChange={(e) => {
                setExerciseTypeId(e.target.value);
              }}
            >
              {data?.exerciseTypes.edges.map((item) => (
                <option value={item.node?.id}>{item.node?.name}</option>
              ))}
            </Select>
            <HStack>
              <Link
                fontSize="sm"
                textDecoration="underline"
                to={`/exercise-types/create?returnTo=${encodeURIComponent(
                  `/exercises/${exerciseId}/items/create`
                )}`}
              >
                Skapa ny
              </Link>
              <Spacer />
              <Link
                fontSize="sm"
                textDecoration="underline"
                to={`/exercise-types`}
              >
                Hantera övningstyper
              </Link>
            </HStack>
          </Stack>

          {exerciseType?.loadTypes.map((loadType, i) => {
            return (
              <Box key={loadType.id}>
                <Stack>
                  <FormControl>
                    <FormLabel>{loadType.name}</FormLabel>
                    <InputGroup>
                      <Input
                        name={`loadAmount[${i}].amountValue`}
                        type="number"
                      />
                      <InputRightAddon>{loadType.unit}</InputRightAddon>
                    </InputGroup>
                    <input
                      type="hidden"
                      name={`loadAmount[${i}].loadUnit`}
                      value="kg"
                    />
                    <input
                      type="hidden"
                      name={`loadAmount[${i}].loadTypeId`}
                      value={loadType.id}
                    />
                  </FormControl>
                </Stack>
              </Box>
            );
          })}

          {exerciseType?.defaultAmountType === AmountType.Time ? (
            <Box>
              <input type="hidden" name="amountType" value="time" />
              <Stack>
                {/* <HStack>
            <Heading as="h3" size="sm">
              Mängd
            </Heading>
            <Spacer />
            <Box>
              <Select name="amountType" label="Typ" hideLabel size="sm">
                <option value="time">Tid</option>
                <option value="repetitions">Repetitioner</option>
              </Select>
            </Box>
          </HStack> */}

                <FormControl>
                  <FormLabel>Längd</FormLabel>
                  <HStack>
                    <Input
                      type="number"
                      name="durationHours"
                      placeholder="Timmar"
                    />
                    <Input
                      type="number"
                      name="durationMinutes"
                      placeholder="Minuter"
                    />
                    <Input
                      type="number"
                      name="durationSeconds"
                      placeholder="Sekunder"
                    />
                  </HStack>
                </FormControl>
              </Stack>
            </Box>
          ) : exerciseType?.defaultAmountType === AmountType.Repetitions ? (
            <Box>
              <input type="hidden" name="amountType" value="repetitions" />
              <Stack>
                {/* <HStack>
                <Heading as="h3" size="sm">
                  Mängd
                </Heading>
                <Spacer />
                <Box>
                  <Select name="amountType" label="Typ" hideLabel size="sm">
                    <option value="time">Tid</option>
                    <option value="repetitions">Repetitioner</option>
                  </Select>
                </Box>
              </HStack> */}

                <FormControl>
                  <FormLabel>Antal</FormLabel>
                  <Input type="number" name="repetitions" />
                </FormControl>
              </Stack>
            </Box>
          ) : null}

          <Box>
            <SubmitButton>Spara</SubmitButton>
          </Box>
        </Stack>
      </ValidatedForm>
    </Container>
  );
}
