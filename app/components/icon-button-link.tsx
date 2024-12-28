import type { ComponentProps } from "react";
import { ButtonLink } from "./button-link";

export function IconButtonLink({
  to,
  ...props
}: { to: string } & ComponentProps<typeof ButtonLink>) {
  return <ButtonLink to={to} variant="ghost" {...props} />;
}
