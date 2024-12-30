import { useState, type ReactNode } from "react";
import { useField } from "remix-validated-form";
import { Combobox } from "../ui/combobox";
import { FormControl } from "../ui/form-control";
import { FormErrorMessage } from "../ui/form-error-message";
import { FormLabel } from "../ui/form-label";

export function ValidatedComboboxField({
  name,
  label,
  hideLabel,
  options,
}: {
  name: string;
  label: string;
  hideLabel?: boolean;
  options: { value: string; label: ReactNode }[];
}) {
  const { error, getInputProps } = useField(name);
  const inputProps = getInputProps({ id: name } as any);
  const [value, setValue] = useState<string[]>(inputProps.defaultValue || []);

  return (
    <FormControl>
      <FormLabel htmlFor={name} hidden={hideLabel}>
        {label}
      </FormLabel>
      <div className="flex flex-col">
        {value.map((v) => (
          <input key={v} type="hidden" name={name} value={v} />
        ))}
        <Combobox
          {...inputProps}
          options={options}
          value={value}
          onChange={(value) => {
            setValue(value);
            inputProps.onChange?.(value);
          }}
        />
      </div>
      {error ? <FormErrorMessage>{error}</FormErrorMessage> : null}
    </FormControl>
  );
}
