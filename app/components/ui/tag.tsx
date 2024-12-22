import type { ComponentProps } from "react";
import { cn } from "~/lib/utils";

export function Tag({ children, className }: ComponentProps<"div">) {
  return (
    <button
      type="button"
      className={cn("block h-7 bg-gray-200 rounded-lg px-2", className)}
    >
      {children}
    </button>
  );
}
