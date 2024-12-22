import type { ComponentProps } from "react";

export function FormLabel({ children }: ComponentProps<"label">) {
  return (
    <label className="text-sm font-medium text-gray-700">{children}</label>
  );
}
