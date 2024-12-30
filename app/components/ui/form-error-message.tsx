import type { ComponentProps } from "react";
import { cn } from "~/lib/utils";

export function FormErrorMessage(props: ComponentProps<"div">) {
  return (
    <div
      {...props}
      className={cn("text-red-500 text-sm font-medium", props.className)}
    />
  );
}
