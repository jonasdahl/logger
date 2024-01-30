import {
  Box,
  Input as ChakraInput,
  Container,
  FormControl,
  FormLabel,
  HStack,
  Heading,
  IconButton,
  Stack,
  Table,
  Tbody,
  Td,
  Tr,
} from "@chakra-ui/react";
import { faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ExerciseAmountType } from "@prisma/client";
import { ActionFunctionArgs, redirect } from "@remix-run/node";
import { withZod } from "@remix-validated-form/with-zod";
import { useState } from "react";
import { ValidatedForm } from "remix-validated-form";
import { v4 } from "uuid";
import { z } from "zod";
import { authenticator } from "~/auth.server";
import { Input } from "~/components/form/input";
import { Select } from "~/components/form/select";
import { SubmitButton } from "~/components/form/submit-button";
import { db } from "~/db.server";
import { HiddenReturnToInput } from "~/services/return-to";
import { addSearchParamToPath } from "~/utils/add-search-param-to-path";
import { formDataToObject } from "~/utils/form-data-to-object";

const validatorSchema = z.object({
  name: z.string(),
  returnTo: z.string().optional(),
  defaultAmountType: z.union([
    z.literal("null"),
    z.literal("time"),
    z.literal("repetitions"),
    z.literal("levels"),
  ]),
});

const schema = z.intersection(
  validatorSchema,
  z.object({
    loads: z
      .array(z.object({ name: z.string(), unit: z.string().optional() }))
      .optional(),
    levels: z.array(z.object({ name: z.string() })).optional(),
  })
);

const validator = withZod(validatorSchema);

export async function action({ request, params }: ActionFunctionArgs) {
  const { id: userId } = await authenticator.isAuthenticated(request, {
    failureRedirect: "/",
  });

  const formData = await request.formData();
  const rawData = formDataToObject(formData);
  const data = schema.parse(rawData);

  const exerciseType = await db.exerciseType.create({
    data: {
      name: data.name,
      userId,
      defaultExerciseAmountType:
        data.defaultAmountType === "time"
          ? ExerciseAmountType.Time
          : data.defaultAmountType === "levels"
          ? ExerciseAmountType.Levels
          : data.defaultAmountType === "repetitions"
          ? ExerciseAmountType.Repetitions
          : undefined,
      loads: {
        create: data.loads?.map((load) => ({
          name: load.name,
          unit: load.unit || undefined,
        })),
      },
      levels: {
        create: data.levels?.map((load, i) => ({
          name: load.name,
          order: i,
        })),
      },
    },
  });

  return redirect(
    addSearchParamToPath(
      data.returnTo ?? "/exercise-types",
      "createdExerciseTypeId",
      exerciseType.id
    )
  );
}

export default function Activity() {
  const [loads, setLoads] = useState<string[]>([]);
  const [levels, setLevels] = useState<string[]>([""]);
  const [defaultAmountType, setDefaultAmountType] = useState("null");

  return (
    <Container py={5} maxW="container.md">
      <ValidatedForm method="post" validator={validator}>
        <HiddenReturnToInput />
        <Stack spacing={5}>
          <Heading as="h1">Ny övningstyp</Heading>
          <Stack>
            <Input name="name" label="Namn" />
            <Select
              name="defaultAmountType"
              label="Mängdtyp"
              value={defaultAmountType}
              onChange={(e) => {
                setDefaultAmountType(e.target.value);
              }}
            >
              <option value="null">- Välj -</option>
              <option value="time">Tid</option>
              <option value="repetitions">Repetitioner</option>
              <option value="levels">Nivåer</option>
            </Select>
            {defaultAmountType === "levels" ? (
              <FormControl>
                <FormLabel>Nivåer</FormLabel>
                <Stack w="100%">
                  {levels.map((id, i) => {
                    return (
                      <HStack w="100%" key={id}>
                        <ChakraInput
                          type="text"
                          name={`levels[${i}].name`}
                          placeholder={`Beskrivning`}
                        />
                        <IconButton
                          onClick={() =>
                            setLevels((ids) => ids.filter((v) => v !== id))
                          }
                          icon={<FontAwesomeIcon icon={faTrash} />}
                          aria-label="Ta bort"
                          colorScheme="red"
                          variant="outline"
                        />
                      </HStack>
                    );
                  })}
                </Stack>
                <IconButton
                  type="button"
                  onClick={() => setLevels((old) => [...old, v4()])}
                  icon={<FontAwesomeIcon icon={faPlus} />}
                  aria-label="Lägg till nivå"
                  colorScheme="green"
                  variant="outline"
                />
              </FormControl>
            ) : (
              <FormControl>
                <HStack>
                  <FormLabel>Variabel belastning</FormLabel>
                </HStack>
                <Table>
                  <Tbody>
                    {loads.map((id, i) => (
                      <Tr key={id}>
                        <Td p={0}>
                          <ChakraInput
                            type="text"
                            name={`loads[${i}].name`}
                            placeholder={`Namn, tex "Vikt"`}
                          />
                        </Td>
                        <Td p={0}>
                          <ChakraInput
                            type="text"
                            name={`loads[${i}].unit`}
                            placeholder={`Enhet, tex "kg"`}
                          />
                        </Td>
                        <Td p={0} w={1}>
                          <IconButton
                            onClick={() =>
                              setLoads((ids) => ids.filter((v) => v !== id))
                            }
                            icon={<FontAwesomeIcon icon={faTrash} />}
                            aria-label="Ta bort"
                            colorScheme="red"
                            variant="outline"
                          />
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>

                <Box>
                  <IconButton
                    onClick={() => setLoads((ids) => [...ids, v4()])}
                    icon={<FontAwesomeIcon icon={faPlus} />}
                    aria-label="Lägg till"
                    colorScheme="green"
                    variant="outline"
                  />
                </Box>
              </FormControl>
            )}
          </Stack>
          <Box>
            <SubmitButton>Spara</SubmitButton>
          </Box>
        </Stack>
      </ValidatedForm>
    </Container>
  );
}
