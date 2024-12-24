import { Link as RemixLink } from "@remix-run/react";
import type { ButtonProps } from "./ui/button";
import { Button } from "./ui/button";

export function ButtonLink({ to, ...props }: { to: string } & ButtonProps) {
  return (
    <Button {...props} asChild>
      <RemixLink to={to}>{props.children}</RemixLink>
    </Button>
  );
}
