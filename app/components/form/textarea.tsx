import { useField } from "remix-validated-form";
import { FormControl } from "../ui/form-control";
import { FormErrorMessage } from "../ui/form-error-message";
import { FormLabel } from "../ui/form-label";
import { Textarea } from "../ui/textarea";

export function ValidatedTextareaField({
  name,
  label,
  defaultValue,
}: {
  name: string;
  defaultValue?: string;
  label: string;
}) {
  const { error, getInputProps } = useField(name);
  const inputProps = getInputProps({ id: name } as any);
  return (
    <FormControl>
      <FormLabel htmlFor={name}>{label}</FormLabel>
      <Textarea
        {...inputProps}
        defaultValue={inputProps.defaultValue ?? defaultValue}
      />
      {error ? <FormErrorMessage>{error}</FormErrorMessage> : null}
    </FormControl>
  );
}
