import type { ComponentProps } from "react";
import { cn } from "~/lib/utils";

export function Container(props: ComponentProps<"div">) {
  return (
    <div
      {...props}
      className={cn(
        `container mx-auto px-4 py-5 max-w-screen-md`,
        props.className
      )}
    />
  );
}
