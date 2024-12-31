import { NavLink } from "@remix-run/react";
import type { ReactNode } from "react";

export function TitleHero({
  title,
  primaryAction,
  tabs,
}: {
  title: ReactNode;
  primaryAction?: ReactNode;
  tabs?: ReactNode[];
}) {
  return (
    <div className="flex flex-col border-b">
      <div className="flex flex-col justify-between gap-4 p-4">
        <div>{title}</div>
        {primaryAction ? <div className="flex">{primaryAction}</div> : null}
      </div>
      {tabs?.length ? (
        <div className="border-t py-4 px-5 overflow-x-auto">{tabs}</div>
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
