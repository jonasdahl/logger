import type { LoaderFunctionArgs } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";

import type { ReactNode } from "react";
import { authenticator } from "~/.server/auth.server";
import { ButtonLink } from "~/components/button-link";
import { H1, H2 } from "~/components/headings";
import { Button } from "~/components/ui/button";
import { Card, CardHeader, CardTitle } from "~/components/ui/card";
import { Container } from "~/components/ui/container";
import { db } from "~/db.server";

export async function loader({ request }: LoaderFunctionArgs) {
  const sessionUser = await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  });
  const user = await db.user.findFirstOrThrow({
    where: { id: sessionUser.id },
  });
  if (user.onboardedAt === null) {
    await db.user.update({
      where: { id: user.id },
      data: { onboardedAt: new Date() },
    });
  }
  return { user: { polarUserId: user.polarUserId } };
}

export default function Connections() {
  const { user } = useLoaderData<typeof loader>();

  return (
    <Container className="flex flex-col gap-5">
      <H1>Anslutningar</H1>

      <div className="flex flex-col gap-3">
        <H2>Importera</H2>
        <div className="flex flex-col gap-2">
          <AvailableConnection
            name="Fogis"
            callToActionText="Synka nu"
            action="/connections/fogis"
          />
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <H2>Synkronisera</H2>
        <div className="flex flex-col gap-2">
          {user.polarUserId ? (
            <WorkingConnection name="Polar">
              <Form action="/connections/polar/sync" method="post">
                <Button type="submit" size="sm" variant="secondary">
                  Synka
                </Button>
              </Form>
              <ButtonLink
                to="/connections/polar/remove"
                size="sm"
                variant="destructive"
              >
                Ta bort
              </ButtonLink>
            </WorkingConnection>
          ) : (
            <AvailableConnection
              name="Polar"
              callToActionText="Lägg till"
              action="/connections/polar"
            />
          )}
        </div>
      </div>
    </Container>
  );
}

function AvailableConnection({
  name,
  callToActionText,
  action,
}: {
  name: string;
  callToActionText: string;
  action: string;
}) {
  return (
    <Card className="flex flex-row justify-between gap-3 items-center p-3 pl-5">
      <CardHeader>
        <CardTitle>{name}</CardTitle>
      </CardHeader>
      <ButtonLink to={action} size="sm" variant="secondary">
        {callToActionText}
      </ButtonLink>
    </Card>
  );
}

function WorkingConnection({
  name,
  children,
}: {
  name: string;
  children: ReactNode;
}) {
  return (
    <Card className="flex flex-row justify-between gap-3 items-center p-3 pl-5">
      <CardHeader>
        <CardTitle>{name}</CardTitle>
      </CardHeader>
      <div className="flex flex-row gap-3 items-center">{children}</div>
    </Card>
  );
}
