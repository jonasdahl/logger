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

export const H2 = forwardRef<HTMLHeadingElement, ComponentProps<"h2">>(
  (props, ref) => {
    return (
      <h2
        ref={ref}
        {...props}
        className={cx("font-bold text-xl", props.className)}
      />
    );
  }
);

H2.displayName = "H2";

export const H3 = forwardRef<HTMLHeadingElement, ComponentProps<"h3">>(
  (props, ref) => {
    return (
      <h3
        ref={ref}
        {...props}
        className={cx("font-bold text-lg", props.className)}
      />
    );
  }
);

H3.displayName = "H3";
