import type { LinkProps } from "@chakra-ui/react";
import { Link as ChakraLink } from "@chakra-ui/react";
import { Link as RemixLink } from "@remix-run/react";

export function Link({ to, ...props }: { to: string } & LinkProps) {
  return <ChakraLink as={RemixLink} to={to} {...props} />;
}
