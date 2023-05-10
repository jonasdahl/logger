import {
  Textarea as ChakraTextarea,
  FormControl,
  FormErrorMessage,
  FormLabel,
} from "@chakra-ui/react";
import { useField } from "remix-validated-form";

export function Textarea({
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
    <FormControl isInvalid={!!error}>
      <FormLabel htmlFor={name}>{label}</FormLabel>
      <ChakraTextarea
        bg="white"
        {...getInputProps({ id: name } as any)}
        defaultValue={defaultValue}
      />
      {error && (
        <FormErrorMessage className="my-error-class">{error}</FormErrorMessage>
      )}
    </FormControl>
  );
}
