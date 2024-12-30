import type { IconDefinition } from "@fortawesome/free-solid-svg-icons";
import {
  faBars,
  faCalendar,
  faEllipsis,
  faHome,
  faLineChart,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "@remix-run/react";
import type { BottomMenuCurrentActivityFragment } from "~/graphql/generated/documents";
import { cn } from "~/lib/utils";

export function BottomMenu({
  currentActivity,
}: {
  currentActivity?: BottomMenuCurrentActivityFragment;
}) {
  return (
    <div className="fixed inset-x-0 bottom-0 bg-white drop-shadow-lg border-t">
      <div className="flex flex-row gap-3 items-center justify-center max-w-[30rem] mx-auto">
        <BottomMenuItem icon={faHome} label="Start" to="/" />
        <BottomMenuItem icon={faCalendar} label="Kalender" to="/calendar" />
        <Link
          to="/actions"
          className={cn(
            "py-3 flex flex-col items-center justify-center w-20 h-20 truncate rounded-lg text-white -mt-6 -mb-6 transition-colors drop-shadow",
            currentActivity?.__typename === "Exercise"
              ? "bg-green-600"
              : "bg-black"
          )}
        >
          <div
            className={cn(
              "flex flex-col items-center justify-center text-white text-2xl",
              currentActivity?.__typename === "Exercise" && "animate-pulse"
            )}
          >
            <FontAwesomeIcon icon={faBars} />
          </div>
        </Link>
        <BottomMenuItem
          icon={faLineChart}
          label="Statistik"
          to={`/stats/exercise-types`}
        />
        <BottomMenuItem icon={faEllipsis} label="Mer" to="/more" />
      </div>
    </div>
  );
}

function BottomMenuItem({
  icon,
  label,
  to,
}: {
  icon: IconDefinition;
  label: string;
  to: string;
}) {
  return (
    <Link
      to={to}
      className="py-3 flex flex-col items-center justify-center flex-1 truncate rounded-lg drop-shadow-lg"
    >
      <span>
        <FontAwesomeIcon icon={icon} />
      </span>
      <span className="truncate max-w-full text-sm">{label}</span>
    </Link>
  );
}
