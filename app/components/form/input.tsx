import type { InputProps } from "@chakra-ui/react";
import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input as ChakraInput,
} from "@chakra-ui/react";
import { useField } from "remix-validated-form";

export function Input({
  name,
  label,
  type,
  autoComplete,
  defaultValue,
}: {
  name: string;
  defaultValue?: string;
  label: string;
  type?: InputProps["type"];
  autoComplete?: string;
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
      />
      {error && (
        <FormErrorMessage className="my-error-class">{error}</FormErrorMessage>
      )}
    </FormControl>
  );
}
