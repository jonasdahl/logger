import {
  Box,
  Button,
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
import { ExerciseAmountType } from "@prisma/client";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useLoaderData, useParams, useSearchParams } from "@remix-run/react";
import { withZod } from "@remix-validated-form/with-zod";
import { useRef, useState } from "react";
import { ValidatedForm } from "remix-validated-form";
import { z } from "zod";
import { authenticator } from "~/.server/auth.server";
import { ButtonLink } from "~/components/button-link";
import { ValidatedSelectField } from "~/components/form/select";
import { SubmitButton } from "~/components/form/submit-button";
import { validate } from "~/components/form/validate.server";
import { InlineLink } from "~/components/ui/inline-link";
import { db } from "~/db.server";
import {
  AmountType,
  CreateExerciseItemDocument,
} from "~/graphql/generated/documents";
import { gql } from "~/graphql/graphql.server";
import { HiddenReturnToInput } from "~/services/return-to";
import { ExerciseCombobox } from "../components.exercise-type-selector/route";

const validatedSchema = z.intersection(
  z.object({
    exerciseTypeId: z.string(),
    returnTo: z.string().optional(),
    loadAmount: z
      .array(
        z.object({
          amountValue: z.coerce.number(),
          loadUnit: z.string(),
          loadTypeId: z.string(),
        })
      )
      .optional(),
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
        durationMilliSeconds:
          ((v.durationSeconds ?? 0) +
            (v.durationMinutes ?? 0) * 60 +
            (v.durationHours ?? 0) * 60 * 60) *
          1000,
      })),
    z.object({
      amountType: z.literal("repetitions"),
      repetitions: z.coerce.number(),
    }),
    z.object({
      amountType: z.literal("levels"),
      level: z.string(),
    }),
  ])
);
const validator = withZod(validatedSchema);

export async function loader({ request, params }: LoaderFunctionArgs) {
  await authenticator.isAuthenticated(request, { failureRedirect: "/" });

  const { data } = await gql({
    document: CreateExerciseItemDocument,
    request,
    variables: { exerciseId: params.exerciseId! },
  });

  const lastExerciseItem = data?.exercise?.items.edges.at(-1)?.node;

  return json({ data, lastExerciseItem });
}

export async function action({ request, params }: ActionFunctionArgs) {
  const { id: userId } = await authenticator.isAuthenticated(request, {
    failureRedirect: "/",
  });
  const { exerciseId } = await z
    .object({ exerciseId: z.string() })
    .parse(params);

  const data = await validate({ request, validator });

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
              : data.amountType === "levels"
              ? ExerciseAmountType.Levels
              : ExerciseAmountType.Time,
          amountDurationMilliSeconds:
            data.amountType === "time" ? data.durationMilliSeconds : undefined,
          amountRepetitions:
            data.amountType === "repetitions" ? data.repetitions : undefined,
          amountLevelId: data.amountType === "levels" ? data.level : undefined,
          loads: {
            create: data.loadAmount?.map(
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

  return redirect(data.returnTo ?? `/exercises/${activity.id}`);
}

export default function Activity() {
  const { exerciseId } = useParams();
  const { data, lastExerciseItem } = useLoaderData<typeof loader>();
  const [searchParams] = useSearchParams();
  const defaultExerciseTypeId =
    searchParams.get("createdExerciseTypeId") ??
    lastExerciseItem?.exerciseType.id ??
    data?.exerciseTypes?.edges[0]?.node?.id;
  const [exerciseTypeId, setExerciseTypeId] = useState(defaultExerciseTypeId);
  const exerciseType = data?.exerciseTypes.edges.find(
    (e) => e.node?.id === exerciseTypeId
  )?.node;

  const templateLoadAmounts = exerciseType?.lastExerciseItem?.amount ?? [];
  const templateLoadAmount = templateLoadAmounts[0];

  const formRef = useRef<HTMLFormElement>(null);

  return (
    <Container py={5} maxW="container.md">
      <HiddenReturnToInput />
      <ValidatedForm formRef={formRef} method="post" validator={validator}>
        <Stack spacing={5}>
          <Heading as="h1">Ny övning</Heading>
          <Stack spacing={1}>
            <FormControl>
              <FormLabel>Övningstyp</FormLabel>
              <ExerciseCombobox
                value={exerciseType ?? undefined}
                onChange={(value) => setExerciseTypeId(value?.id)}
              />
              <input
                type="hidden"
                name="exerciseTypeId"
                value={exerciseTypeId}
              />
            </FormControl>
            <HStack>
              <InlineLink
                className="text-sm underline"
                to={`/exercise-types/create?returnTo=${encodeURIComponent(
                  `/exercises/${exerciseId}/items/create`
                )}`}
              >
                Skapa ny
              </InlineLink>
              <Spacer />
              <InlineLink className="text-sm underline" to={`/exercise-types`}>
                Hantera övningstyper
              </InlineLink>
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
                        step={0.01}
                        defaultValue={
                          templateLoadAmount?.loads.find(
                            (l) => l.type.id === loadType.id
                          )?.value
                        }
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
                {loadType.commonLoads?.length ? (
                  <div className="flex flex-row gap-2 py-2 overflow-x-auto">
                    {loadType.commonLoads.map((load) => (
                      <Button
                        size="xs"
                        key={load.value}
                        onClick={() =>
                          (formRef.current![
                            `loadAmount[${i}].amountValue`
                          ]!.value = load.value?.toString())
                        }
                      >
                        {load.value}
                      </Button>
                    ))}
                  </div>
                ) : null}
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

                <TimeInput
                  defaultDurationSeconds={
                    templateLoadAmount?.duration.__typename ===
                    "ExerciseDurationTime"
                      ? templateLoadAmount?.duration.durationSeconds
                      : undefined
                  }
                />
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
                  <Input
                    type="number"
                    name="repetitions"
                    defaultValue={
                      templateLoadAmount?.duration.__typename ===
                      "ExerciseDurationRepetitions"
                        ? templateLoadAmount?.duration.repetitions
                        : undefined
                    }
                  />
                </FormControl>
              </Stack>
            </Box>
          ) : exerciseType?.defaultAmountType === AmountType.Levels ? (
            <Box>
              <input type="hidden" name="amountType" value="levels" />
              <ValidatedSelectField name="level" label="Nivå">
                {exerciseType.levels.map((level) => (
                  <option key={level.id} value={level.id}>
                    {level.name}
                  </option>
                ))}
              </ValidatedSelectField>
            </Box>
          ) : null}

          <HStack>
            <Box>
              <ButtonLink variant="ghost" to={`/exercises/${exerciseId}`}>
                Avbryt
              </ButtonLink>
            </Box>
            <Spacer />
            <Box>
              <SubmitButton disabled={!exerciseTypeId}>Spara</SubmitButton>
            </Box>
          </HStack>
        </Stack>
      </ValidatedForm>
    </Container>
  );
}

function TimeInput({
  defaultDurationSeconds,
}: {
  defaultDurationSeconds: number | undefined;
}) {
  const defaultDuration = getDurationParts(defaultDurationSeconds);

  const durationHoursRef = useRef<HTMLInputElement>(null);
  const durationMinutesRef = useRef<HTMLInputElement>(null);
  const durationSecondsRef = useRef<HTMLInputElement>(null);

  return (
    <FormControl>
      <HStack>
        <FormLabel>Längd</FormLabel>
        <Spacer />
        <Button
          size="xs"
          onClick={() => {
            durationHoursRef.current!.value = "";
            durationMinutesRef.current!.value = "";
            durationSecondsRef.current!.value = "";
          }}
        >
          Återställ
        </Button>
      </HStack>
      <HStack>
        <Input
          ref={durationHoursRef}
          type="number"
          name="durationHours"
          placeholder="Timmar"
          defaultValue={defaultDuration?.hours}
        />
        <Input
          ref={durationMinutesRef}
          type="number"
          name="durationMinutes"
          placeholder="Minuter"
          defaultValue={defaultDuration?.minutes}
        />
        <Input
          ref={durationSecondsRef}
          type="number"
          name="durationSeconds"
          placeholder="Sekunder"
          step={0.01}
          defaultValue={defaultDuration?.seconds?.toLocaleString("en-US", {
            maximumFractionDigits: 4,
          })}
        />
      </HStack>
    </FormControl>
  );
}

function getDurationParts(durationSeconds: number | undefined) {
  if (!durationSeconds) {
    return undefined;
  }

  const hours = Math.floor(durationSeconds / 60 / 60);
  const minutes = Math.floor(durationSeconds / 60 - hours * 60);
  const seconds = durationSeconds - hours * 60 * 60 - minutes * 60;
  return { hours, minutes, seconds };
}
