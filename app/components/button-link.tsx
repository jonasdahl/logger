import type { ButtonProps } from "@chakra-ui/react";
import { Button } from "@chakra-ui/react";
import { Link as RemixLink } from "@remix-run/react";

export function ButtonLink({ to, ...props }: { to: string } & ButtonProps) {
  return <Button to={to} as={RemixLink} {...props} />;
}
