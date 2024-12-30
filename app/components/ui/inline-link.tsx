import { Link } from "@remix-run/react";
import type { ComponentProps } from "react";
import React from "react";
import { cn } from "~/lib/utils";

export const InlineLink = React.forwardRef<
  HTMLAnchorElement,
  ComponentProps<typeof Link>
>(({ className, ...props }, ref) => (
  <Link
    ref={ref}
    className={cn(
      "font-medium text-gray-800 underline-offset-2 decoration-dotted underline hover:decoration-solid",
      className
    )}
    {...props}
  >
    {props.children}
  </Link>
));
InlineLink.displayName = "InlineLink";
