import {
  Box,
  Input as ChakraInput,
  Select as ChakraSelect,
  Container,
  FormControl,
  FormLabel,
  HStack,
  Heading,
  Spacer,
  Stack,
  Table,
  Tbody,
  Td,
  Tr,
} from "@chakra-ui/react";
import { HiddenReturnToInput } from "~/services/return-to";

import { withZod } from "@remix-validated-form/with-zod";
import { ValidatedForm } from "remix-validated-form";
import { z } from "zod";
import { SubmitButton } from "~/components/form/submit-button";

import { ExerciseAmountType } from "@prisma/client";
import { ActionFunctionArgs, redirect } from "@remix-run/node";
import { range } from "lodash";
import { useState } from "react";
import { authenticator } from "~/auth.server";
import { Input } from "~/components/form/input";
import { Select } from "~/components/form/select";
import { db } from "~/db.server";
import { addSearchParamToPath } from "~/utils/add-search-param-to-path";
import { formDataToObject } from "~/utils/form-data-to-object";

const validatorSchema = z.object({
  name: z.string(),
  returnTo: z.string().optional(),
  defaultAmountType: z.union([
    z.literal("null"),
    z.literal("time"),
    z.literal("repetitions"),
  ]),
});

const schema = z.intersection(
  validatorSchema,
  z.object({
    loads: z
      .array(z.object({ name: z.string(), unit: z.string().optional() }))
      .optional(),
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
          : data.defaultAmountType === "repetitions"
          ? ExerciseAmountType.Repetitions
          : undefined,
      loads: {
        create: data.loads?.map((load) => ({
          name: load.name,
          unit: load.unit || undefined,
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
  const [loads, setLoads] = useState(1);

  return (
    <Container py={5}>
      <ValidatedForm method="post" validator={validator}>
        <HiddenReturnToInput />
        <Stack spacing={5}>
          <Heading as="h1">Ny övningstyp</Heading>
          <Stack>
            <Input name="name" label="Namn" />
            <Select name="defaultAmountType" label="Mängdtyp">
              <option value="null">- Välj -</option>
              <option value="time">Tid</option>
              <option value="repetitions">Repetitioner</option>
            </Select>
            <FormControl>
              <HStack>
                <FormLabel>Variabel belastning</FormLabel>
                <Spacer />
                <Box>
                  <ChakraSelect
                    size="xs"
                    value={loads}
                    onChange={(e) => setLoads(Number(e.target.value))}
                  >
                    <option value={0}>0</option>
                    <option value={1}>1</option>
                    <option value={2}>2</option>
                    <option value={3}>3</option>
                  </ChakraSelect>
                </Box>
              </HStack>
              <Table>
                <Tbody>
                  {range(0, loads).map((i) => (
                    <Tr key={i}>
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
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </FormControl>
          </Stack>
          <Box>
            <SubmitButton>Spara</SubmitButton>
          </Box>
        </Stack>
      </ValidatedForm>
    </Container>
  );
}
