import {
  Input as ChakraInput,
  FormControl,
  FormLabel,
  HStack,
  IconButton,
  Stack,
  Table,
  Tbody,
  Td,
  Tr,
} from "@chakra-ui/react";
import { faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { ValidatedForm } from "remix-validated-form";
import { v4 } from "uuid";
import { ValidatedSelectField } from "~/components/form/select";
import { SubmitButton } from "~/components/form/submit-button";
import { Textarea } from "~/components/form/textarea";
import { ValidatedInputField } from "~/components/form/validated-input-field";
import { HiddenReturnToInput } from "~/services/return-to";
import { exerciseTypeValidator } from "./schema";

export function ExerciseTypeForm() {
  const [loads, setLoads] = useState<string[]>([]);
  const [defaultAmountType, setDefaultAmountType] = useState("null");

  return (
    <ValidatedForm method="post" validator={exerciseTypeValidator}>
      <HiddenReturnToInput />
      <Stack spacing={5}>
        <Stack>
          <ValidatedInputField name="name" label="Namn" />
          <ValidatedSelectField
            name="defaultAmountType"
            label="Mängdtyp"
            value={defaultAmountType}
            onChangeValue={(value) => setDefaultAmountType(value)}
            options={[
              { value: "null", label: "- Välj -" },
              { value: "time", label: "Tid" },
              { value: "repetitions", label: "Repetitioner" },
              { value: "levels", label: "Nivåer" },
            ]}
          />
          {defaultAmountType === "levels" ? (
            <Textarea name="levels" label="Nivåer (en per rad)" />
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

              <div>
                <IconButton
                  onClick={() => setLoads((ids) => [...ids, v4()])}
                  icon={<FontAwesomeIcon icon={faPlus} />}
                  aria-label="Lägg till"
                  colorScheme="green"
                  variant="outline"
                />
              </div>
            </FormControl>
          )}
        </Stack>
        <div>
          <SubmitButton>Spara</SubmitButton>
        </div>
      </Stack>
    </ValidatedForm>
  );
}
