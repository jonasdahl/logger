import type { InputProps } from "@chakra-ui/react";
import {
  Input as ChakraInput,
  FormControl,
  FormErrorMessage,
  FormLabel,
} from "@chakra-ui/react";
import { useField } from "remix-validated-form";

export function Input({
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
  type?: InputProps["type"];
  autoComplete?: string;
  autoFocus?: boolean;
}) {
  const { error, getInputProps } = useField(name);
  const inputProps = getInputProps({ id: name } as any);
  return (
    <FormControl isInvalid={!!error}>
      <FormLabel htmlFor={name}>{label}</FormLabel>
      <ChakraInput
        type={type}
        {...inputProps}
        autoComplete={autoComplete}
        defaultValue={inputProps?.defaultValue ?? defaultValue}
        autoFocus={autoFocus}
      />
      {error && (
        <FormErrorMessage className="my-error-class">{error}</FormErrorMessage>
      )}
    </FormControl>
  );
}
