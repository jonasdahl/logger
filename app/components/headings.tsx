import type { ComponentProps } from "react";
import { forwardRef } from "react";
import { cx } from "~/utils/cx";

export const H1 = forwardRef<HTMLHeadingElement, ComponentProps<"h1">>(
  (props, ref) => {
    return (
      <h1
        ref={ref}
        {...props}
        className={cx("font-bold text-2xl", props.className)}
      />
    );
  }
);

H1.displayName = "H1";
