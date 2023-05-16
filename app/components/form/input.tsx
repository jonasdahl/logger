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
  return (
    <FormControl isInvalid={!!error}>
      <FormLabel htmlFor={name}>{label}</FormLabel>
      <ChakraInput
        type={type}
        {...getInputProps({ id: name } as any)}
        autoComplete={autoComplete}
        defaultValue={defaultValue}
        autoFocus={autoFocus}
      />
      {error && (
        <FormErrorMessage className="my-error-class">{error}</FormErrorMessage>
      )}
    </FormControl>
  );
}
