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
  return (
    <FormControl>
      <FormLabel htmlFor={name}>{label}</FormLabel>
      <Textarea
        {...getInputProps({ id: name } as any)}
        defaultValue={defaultValue}
      />
      {error ? <FormErrorMessage>{error}</FormErrorMessage> : null}
    </FormControl>
  );
}
