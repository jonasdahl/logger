import type { ReactNode } from "react";
import { useField } from "remix-validated-form";
import { Combobox } from "../ui/combobox";
import { FormControl } from "../ui/form-control";
import { FormErrorMessage } from "../ui/form-error-message";
import { FormLabel } from "../ui/form-label";

export function ValidatedComboboxField({
  name,
  label,
  hideLabel,
  value,
  options,
}: {
  name: string;
  label: string;
  hideLabel?: boolean;
  value?: string;
  options: { value: string; label: ReactNode }[];
}) {
  const { error, getInputProps } = useField(name);
  const inputProps = getInputProps({ id: name, value } as any);
  return (
    <FormControl>
      <FormLabel htmlFor={name} hidden={hideLabel}>
        {label}
      </FormLabel>
      <Combobox
        {...inputProps}
        options={options}
        value={[]}
        onChange={(value) => {
          inputProps.onChange?.(value);
        }}
      />
      {error ? <FormErrorMessage>{error}</FormErrorMessage> : null}
    </FormControl>
  );
}
