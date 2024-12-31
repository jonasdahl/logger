import { NavLink } from "@remix-run/react";
import type { ReactNode } from "react";
import { cn } from "~/lib/utils";

export function TitleHero({
  title,
  primaryAction,
  tabs,
  maxWidthClassName,
}: {
  title: ReactNode;
  primaryAction?: ReactNode;
  tabs?: ReactNode[];
  maxWidthClassName?: string;
}) {
  const maxW = maxWidthClassName ?? "max-w-md";
  return (
    <div className="flex flex-col border-b">
      <div
        className={cn(
          "flex flex-col justify-between gap-4 py-4 px-4 mx-auto w-full",
          maxW
        )}
      >
        <div>{title}</div>
        {primaryAction ? <div className="flex">{primaryAction}</div> : null}
      </div>
      {tabs?.length ? (
        <div className="border-t">
          <div className={cn("py-4 px-4 overflow-x-auto w-full mx-auto", maxW)}>
            {tabs}
          </div>
        </div>
      ) : null}
    </div>
  );
}

export function TitleHeroTabLink({
  to,
  children,
  end,
}: {
  to: string;
  children: ReactNode;
  end?: boolean;
}) {
  return (
    <NavLink
      to={to}
      className="rounded-full [&.active]:bg-gray-100 text-sm px-4 py-1.5"
      end={end}
    >
      {children}
    </NavLink>
  );
}
