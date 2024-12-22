import type { ComponentProps } from "react";

export function FormControl({ children }: ComponentProps<"div">) {
  return <div className="flex flex-col gap-1">{children}</div>;
}
