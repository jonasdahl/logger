import { H1, H2 } from "~/components/headings";
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
import { InlineLink } from "~/components/ui/inline-link";

import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { Check } from "lucide-react";
import { authenticator } from "~/.server/auth.server";
import { ButtonLink } from "~/components/button-link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Progress } from "~/components/ui/progress";
import { TitleRow } from "~/components/ui/title-row";
import { db } from "~/db.server";

export async function loader({ request, params }: LoaderFunctionArgs) {
  const { id: userId } = await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  });
  const goals = await db.goal.findMany({
    where: { userId },
  });
  return json({ goals });
}

export default function Index() {
  const { goals } = useLoaderData<typeof loader>();

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
              <Card key={goal.id}>
                <div className="flex flex-row gap-5 justify-between">
                  <CardHeader>
                    <CardTitle>{goal.name}</CardTitle>
                    <CardDescription>{goal.type}</CardDescription>
                  </CardHeader>

                  <div className="px-6 flex flex-col justify-center items-center self-stretch">
                    <Check />
                  </div>
                </div>

                <CardContent>
                  <Progress value={50} indicatorClassName="bg-yellow-500" />
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
