import { faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { ValidatedForm } from "remix-validated-form";
import { v4 } from "uuid";
import { ValidatedSelectField } from "~/components/form/select";
import { SubmitButton } from "~/components/form/submit-button";
import { ValidatedTextareaField } from "~/components/form/textarea";
import { ValidatedInputField } from "~/components/form/validated-input-field";
import { Button } from "~/components/ui/button";
import { FormControl } from "~/components/ui/form-control";
import { FormLabel } from "~/components/ui/form-label";
import { FormStack } from "~/components/ui/form-stack";
import { Input } from "~/components/ui/input";
import { HiddenReturnToInput } from "~/services/return-to";
import { exerciseTypeValidator } from "./schema";

export function ExerciseTypeForm() {
  const [loads, setLoads] = useState<string[]>([]);
  const [defaultAmountType, setDefaultAmountType] = useState("null");

  return (
    <ValidatedForm method="post" validator={exerciseTypeValidator}>
      <HiddenReturnToInput />

      <FormStack>
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
          <ValidatedTextareaField name="levels" label="Nivåer (en per rad)" />
        ) : (
          <FormControl>
            <FormLabel>Variabel belastning</FormLabel>
            <div className="flex flex-col gap-1">
              {loads.map((id, i) => (
                <div key={id} className="flex flex-row gap-1">
                  <div className="flex flex-1">
                    <Input
                      type="text"
                      name={`loads[${i}].name`}
                      placeholder={`Namn, tex "Vikt"`}
                    />
                  </div>
                  <div className="flex flex-1">
                    <Input
                      type="text"
                      name={`loads[${i}].unit`}
                      placeholder={`Enhet, tex "kg"`}
                    />
                  </div>
                  <div className="flex flex-0">
                    <Button
                      onClick={() =>
                        setLoads((ids) => ids.filter((v) => v !== id))
                      }
                      variant="destructive"
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            <div>
              <Button
                onClick={() => setLoads((ids) => [...ids, v4()])}
                variant="outline"
                type="button"
              >
                <FontAwesomeIcon icon={faPlus} /> Lägg till mängdtyp
              </Button>
            </div>
          </FormControl>
        )}
        <div>
          <SubmitButton>Spara</SubmitButton>
        </div>
      </FormStack>
    </ValidatedForm>
  );
}
