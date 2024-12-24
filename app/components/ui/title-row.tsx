import type { ReactNode } from "react";

export function TitleRow({
  children,
  actions,
}: {
  children: ReactNode;
  actions?: ReactNode;
}) {
  return (
    <div className="flex flex-row justify-between gap-3 items-end">
      {children}
      {actions ? <div>{actions}</div> : null}
    </div>
  );
}
