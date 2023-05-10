import {
  Select as ChakraSelect,
  FormControl,
  FormErrorMessage,
  FormLabel,
} from "@chakra-ui/react";
import type { ReactNode } from "react";
import { useField } from "remix-validated-form";

export function Select({
  name,
  label,
  defaultValue,
  children,
}: {
  name: string;
  defaultValue?: string;
  label: string;
  children: ReactNode;
}) {
  const { error, getInputProps } = useField(name);
  return (
    <FormControl isInvalid={!!error}>
      <FormLabel htmlFor={name}>{label}</FormLabel>
      <ChakraSelect
        {...getInputProps({ id: name } as any)}
        defaultValue={defaultValue}
      >
        {children}
      </ChakraSelect>
      {error && (
        <FormErrorMessage className="my-error-class">{error}</FormErrorMessage>
      )}
    </FormControl>
  );
}
