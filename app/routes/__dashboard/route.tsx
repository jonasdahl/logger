import { Box, Progress } from "@chakra-ui/react";
import type { IconDefinition } from "@fortawesome/free-solid-svg-icons";
import {
  faCalendar,
  faEllipsis,
  faHome,
  faLineChart,
  faRunning,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Outlet, useLoaderData, useNavigation } from "@remix-run/react";
import { authenticator } from "~/.server/auth.server";
import { Link } from "~/components/link";
import { DashboardDocument } from "~/graphql/generated/documents";
import { gql } from "~/graphql/graphql.server";
import { cx } from "~/utils/cx";

export async function loader({ request }: LoaderFunctionArgs) {
  await authenticator.isAuthenticated(request, { failureRedirect: "/login" });
  const { data } = await gql({
    document: DashboardDocument,
    request,
    variables: {},
  });
  return json({ currentActivity: data?.currentActivity });
}

export default function Dashboard() {
  const { currentActivity } = useLoaderData<typeof loader>();
  const { state } = useNavigation();

  return (
    <Box className="pb-20">
      <Box position="relative">
        {state !== "idle" ? (
          <Progress
            colorScheme="yellow"
            bg="transparent"
            isIndeterminate
            position="absolute"
            left={0}
            right={0}
            bottom={0}
            size="xs"
          />
        ) : null}
      </Box>
      <Outlet />
      <div className="fixed inset-x-0 bottom-0 bg-white drop-shadow-lg border-t">
        <div className="flex flex-row gap-3 items-center justify-center max-w-[30rem] mx-auto">
          <BottomMenuItem icon={faHome} label="Start" to="/" />
          <BottomMenuItem icon={faCalendar} label="Kalender" to="/calendar" />
          <Link
            to={
              currentActivity?.__typename === "Exercise"
                ? `/exercises/${currentActivity.id}`
                : "/exercises/live"
            }
            className={cx(
              "py-3 flex flex-col items-center justify-center w-20 h-20 truncate rounded-full text-white -mt-6 -mb-6 transition-colors",
              currentActivity?.__typename === "Exercise"
                ? "bg-green-600"
                : "bg-blue-500"
            )}
          >
            <div
              className={cx(
                "flex flex-col items-center justify-center",
                currentActivity?.__typename === "Exercise" && "animate-pulse"
              )}
            >
              <span className="text-white">
                <FontAwesomeIcon icon={faRunning} />
              </span>
              <span className="text-white truncate max-w-full">
                {currentActivity?.__typename === "Exercise"
                  ? "Tränar"
                  : "Träna"}
              </span>
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
    </Box>
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
