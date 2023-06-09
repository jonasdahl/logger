import type { LinkProps } from "@chakra-ui/react";
import { Link as ChakraLink } from "@chakra-ui/react";
import { Link as RemixLink } from "@remix-run/react";
import { forwardRef } from "react";

export const Link = forwardRef<HTMLAnchorElement, { to: string } & LinkProps>(
  function Link({ to, ...props }, ref) {
    return (
      <ChakraLink
        as={RemixLink}
        to={to}
        fontWeight="bold"
        _hover={{ textDecoration: "underline" }}
        {...props}
      />
    );
  }
);
