import {
  Select as ChakraSelect,
  FormControl,
  FormErrorMessage,
  FormLabel,
  SelectProps,
} from "@chakra-ui/react";
import type { ReactNode } from "react";
import { useField } from "remix-validated-form";

export function Select({
  name,
  label,
  defaultValue,
  children,
  size,
  hideLabel,
  onChange,
}: {
  name: string;
  defaultValue?: string;
  label: string;
  children: ReactNode;
  size?: SelectProps["size"];
  hideLabel?: boolean;
  onChange?: SelectProps["onChange"];
}) {
  const { error, getInputProps } = useField(name);
  return (
    <FormControl isInvalid={!!error}>
      <FormLabel htmlFor={name} hidden={hideLabel}>
        {label}
      </FormLabel>
      <ChakraSelect
        {...getInputProps({ id: name, onChange } as any)}
        defaultValue={defaultValue}
        size={size}
      >
        {children}
      </ChakraSelect>
      {error && (
        <FormErrorMessage className="my-error-class">{error}</FormErrorMessage>
      )}
    </FormControl>
  );
}
