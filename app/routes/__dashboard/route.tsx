import { Progress } from "@chakra-ui/react";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { Outlet, useLoaderData, useNavigation } from "@remix-run/react";
import { authenticator } from "~/.server/auth.server";
import { DashboardDocument } from "~/graphql/generated/documents";
import { gql } from "~/graphql/graphql.server";
import { BottomMenu } from "./bottom-menu";

export async function loader({ request }: LoaderFunctionArgs) {
  await authenticator.isAuthenticated(request, { failureRedirect: "/login" });
  const { data } = await gql({
    document: DashboardDocument,
    request,
    variables: {},
  });
  return { currentActivity: data?.currentActivity };
}

export default function Dashboard() {
  const { currentActivity } = useLoaderData<typeof loader>();
  const { state } = useNavigation();

  return (
    <div className="pb-20">
      <div className="relative">
        {state !== "idle" || true ? (
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
      </div>
      <Outlet />
      <BottomMenu currentActivity={currentActivity || undefined} />
    </div>
  );
}
