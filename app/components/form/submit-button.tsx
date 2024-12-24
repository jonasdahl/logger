import type { ComponentProps } from "react";
import { useIsSubmitting } from "remix-validated-form";
import { Button } from "../ui/button";

export function SubmitButton(props: ComponentProps<typeof Button>) {
  const isSubmitting = useIsSubmitting();
  return <Button type="submit" disabled={isSubmitting} {...props} />;
}
