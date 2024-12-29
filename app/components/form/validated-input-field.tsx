import type { ComponentProps } from "react";
import { useField } from "remix-validated-form";
import { FormControl } from "../ui/form-control";
import { FormErrorMessage } from "../ui/form-error-message";
import { FormLabel } from "../ui/form-label";
import { Input } from "../ui/input";

export function ValidatedInputField({
  name,
  label,
  type,
  autoComplete,
  defaultValue,
  autoFocus,
}: {
  name: string;
  defaultValue?: string;
  label: string;
  type?: ComponentProps<"input">["type"];
  autoComplete?: string;
  autoFocus?: boolean;
}) {
  const { error, getInputProps } = useField(name);
  const inputProps = getInputProps({ id: name } as any);
  return (
    <FormControl>
      <FormLabel htmlFor={name}>{label}</FormLabel>
      <Input
        type={type}
        {...inputProps}
        autoComplete={autoComplete}
        defaultValue={inputProps?.defaultValue ?? defaultValue}
        autoFocus={autoFocus}
      />
      {error ? <FormErrorMessage>{error}</FormErrorMessage> : null}
    </FormControl>
  );
}
