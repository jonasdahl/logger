import type { ButtonProps } from "@chakra-ui/react";
import { Button } from "@chakra-ui/react";
import { useIsSubmitting } from "remix-validated-form";

export function SubmitButton(props: ButtonProps) {
  const isSubmitting = useIsSubmitting();
  return (
    <Button
      type="submit"
      disabled={isSubmitting}
      isLoading={isSubmitting}
      colorScheme="green"
      {...props}
    />
  );
}
