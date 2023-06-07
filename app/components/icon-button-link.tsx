import type { IconButtonProps } from "@chakra-ui/react";
import { IconButton } from "@chakra-ui/react";
import { Link as RemixLink } from "@remix-run/react";

export function IconButtonLink({
  to,
  ...props
}: { to: string } & IconButtonProps) {
  return <IconButton to={to} as={RemixLink} {...props} />;
}
