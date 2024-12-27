import { H1, H2 } from "~/components/headings";
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
import { InlineLink } from "~/components/ui/inline-link";

import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { authenticator } from "~/.server/auth.server";
import { ButtonLink } from "~/components/button-link";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Progress } from "~/components/ui/progress";
import { TitleRow } from "~/components/ui/title-row";
import { DashboardOverviewDocument } from "~/graphql/generated/documents";
import { gql } from "~/graphql/graphql.server";

export async function loader({ request, params }: LoaderFunctionArgs) {
  const { id: userId } = await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  });
  return json(
    await gql({
      document: DashboardOverviewDocument,
      variables: {},
      request,
    })
  );
}

export default function Index() {
  const { data } = useLoaderData<typeof loader>();
  const goals = data?.goals ?? [];

  return (
    <div className="container mx-auto py-6 px-4 max-w-screen-md flex flex-col gap-5">
      <div className="flex flex-col gap-3">
        <H1>Översikt</H1>
      </div>

      <div className="flex flex-col gap-3">
        <TitleRow
          actions={
            <ButtonLink variant="outline" to={`/goals/create`}>
              Skapa
            </ButtonLink>
          }
        >
          <H2>Mål</H2>
        </TitleRow>
        {!goals.length ? (
          <Alert>
            <AlertTitle>Du har inga mål än</AlertTitle>
            <AlertDescription>
              Kom igång genom att{" "}
              <InlineLink to={`/goals/create`}>
                skapa ditt första mål
              </InlineLink>
              .
            </AlertDescription>
          </Alert>
        ) : (
          goals.map((goal) => {
            return (
              <Card key={goal.id} className="p-4 gap-2">
                <div className="flex flex-row gap-5 justify-between">
                  <CardHeader className="pb-0">
                    <CardTitle>{goal.title}</CardTitle>
                  </CardHeader>

                  {goal.currentProgress && goal.currentProgress >= 1 ? (
                    <div className="flex flex-col justify-center items-center self-stretch text-green-600">
                      <FontAwesomeIcon icon={faCheck} />
                    </div>
                  ) : null}
                </div>

                {typeof goal.currentProgress === "number" ? (
                  <CardContent>
                    <Progress
                      value={goal.currentProgress * 100}
                      className="h-1.5"
                      indicatorClassName={
                        goal.currentProgress >= 1
                          ? "bg-green-600"
                          : "bg-yellow-600"
                      }
                    />
                  </CardContent>
                ) : null}
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
