import type { ReactNode } from "react";
import { useField } from "remix-validated-form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { FormControl } from "../ui/form-control";
import { FormErrorMessage } from "../ui/form-error-message";
import { FormLabel } from "../ui/form-label";

export function ValidatedSelectField({
  name,
  label,
  defaultValue,
  hideLabel,
  onChangeValue,
  value,
  options,
}: {
  name: string;
  defaultValue?: string;
  label: string;
  hideLabel?: boolean;
  onChangeValue?: (value: string) => void;
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
      <Select
        {...inputProps}
        defaultValue={inputProps?.defaultValue ?? defaultValue}
        onValueChange={(value) => {
          onChangeValue?.(value);
          inputProps.onChange?.(value);
        }}
      >
        <SelectTrigger>
          <SelectValue placeholder="Välj..." />
        </SelectTrigger>
        <SelectContent>
          {options.map(({ value, label }) => (
            <SelectItem key={value} value={value}>
              {label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {error ? <FormErrorMessage>{error}</FormErrorMessage> : null}
    </FormControl>
  );
}
