import { H1, H2 } from "~/components/headings";
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
import { InlineLink } from "~/components/ui/inline-link";

import { faCheck, faRunning } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { DateTime } from "luxon";
import { authenticator } from "~/.server/auth.server";
import { ButtonLink } from "~/components/button-link";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Progress } from "~/components/ui/progress";
import { TitleRow } from "~/components/ui/title-row";
import { DashboardOverviewDocument } from "~/graphql/generated/documents";
import { gql } from "~/graphql/graphql.server";

export async function loader({ request }: LoaderFunctionArgs) {
  await authenticator.isAuthenticated(request, { failureRedirect: "/login" });
  return await gql({
    document: DashboardOverviewDocument,
    variables: {},
    request,
  });
}

export default function Index() {
  const { data } = useLoaderData<typeof loader>();
  const goals = data?.goals ?? [];

  return (
    <div className="container mx-auto py-6 px-4 max-w-screen-md flex flex-col gap-5">
      <div className="flex flex-col gap-3">
        <H1>Översikt</H1>
      </div>

      <div>
        {!data?.upcomingPlannedExercise ? (
          <Alert>
            <AlertTitle>Du har inga planerade pass</AlertTitle>
            <AlertDescription>
              <InlineLink
                to={`/planned-activities/create?date=${DateTime.now().toFormat(
                  "yyyy-MM-dd"
                )}`}
              >
                Skapa ett nytt
              </InlineLink>{" "}
              för att planera ditt nästa träningspass.
            </AlertDescription>
          </Alert>
        ) : (
          <Card className="p-4">
            <CardHeader>
              <CardTitle>
                {[
                  data.upcomingPlannedExercise.primaryPurpose?.label,
                  data.upcomingPlannedExercise.secondaryPurpose?.label,
                ]
                  .filter(Boolean)
                  .join(" och ")}
              </CardTitle>
              <CardDescription>
                Planerat pass{" "}
                {DateTime.fromISO(data.upcomingPlannedExercise.start) <
                DateTime.now()
                  ? "idag"
                  : DateTime.fromISO(
                      data.upcomingPlannedExercise.start
                    ).toRelative({ locale: "sv-SE", style: "long" })}
              </CardDescription>
            </CardHeader>
            <CardFooter className="flex flex-row gap-3 justify-between">
              <ButtonLink
                to={`/planned-activities/${data.upcomingPlannedExercise.id}`}
                variant="outline"
              >
                Visa
              </ButtonLink>
              <ButtonLink
                to={`/planned-activities/${data.upcomingPlannedExercise.id}`}
              >
                Starta
              </ButtonLink>
            </CardFooter>
          </Card>
        )}
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
              <Card key={goal.id} className="p-4 gap-2 relative">
                <div className="flex flex-row gap-2 justify-between">
                  <CardHeader className="pb-0 flex-1 overflow-x-hidden flex flex-row items-center gap-2 justify-between">
                    <CardTitle className="truncate">
                      <Link
                        to={`/goals/${goal.id}`}
                        className="after:absolute after:inset-0 truncate"
                      >
                        {goal.title}
                      </Link>
                    </CardTitle>
                    {goal.__typename === "GoalDayOfRest" ? (
                      <CardDescription className="text-nowrap">
                        {goal.currentDaysOfRest} av {goal.targetDaysOfRest}{" "}
                        dagar
                      </CardDescription>
                    ) : null}
                    {goal.__typename === "GoalDayOfWork" ? (
                      <CardDescription className="text-nowrap">
                        {goal.currentDaysOfWork} av {goal.targetDaysOfWork}{" "}
                        dagar
                      </CardDescription>
                    ) : null}
                    {goal.__typename === "GoalPerformExerciseType" ? (
                      <CardDescription className="text-nowrap">
                        {goal.currentDayCount} av {goal.targetDayCount} dagar
                      </CardDescription>
                    ) : null}
                  </CardHeader>

                  <div className="w-6 flex flex-row items-center justify-center">
                    {goal.currentProgress && goal.currentProgress >= 1 ? (
                      <span className="text-green-600">
                        <FontAwesomeIcon icon={faCheck} />
                      </span>
                    ) : (
                      <span className="text-yellow-600">
                        <FontAwesomeIcon icon={faRunning} />
                      </span>
                    )}
                  </div>
                </div>

                {typeof goal.currentProgress === "number" ? (
                  <CardContent>
                    <Progress
                      value={goal.currentProgress * 100}
                      className="h-1.5 pointer-events-none"
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
