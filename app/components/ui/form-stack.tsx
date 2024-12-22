import type { ComponentProps } from "react";

export function FormStack({ children }: ComponentProps<"div">) {
  return <div className="flex flex-col gap-3">{children}</div>;
}
