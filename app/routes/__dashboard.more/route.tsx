import type { IconDefinition } from "@fortawesome/free-solid-svg-icons";
import {
  faCheck,
  faCode,
  faLink,
  faList,
  faRightFromBracket,
  faRunning,
  faSquare,
  faUserCog,
  faUserLock,
  faWeight,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import { authenticator, isAdmin } from "~/.server/auth.server";
import { ButtonLink } from "~/components/button-link";
import { Button } from "~/components/ui/button";
import { Container } from "~/components/ui/container";
import { Separator } from "~/components/ui/separator";

export async function loader({ request }: LoaderFunctionArgs) {
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  });
  return json({ isAdmin: await isAdmin(user.id) });
}

export default function Dashboard() {
  const { isAdmin } = useLoaderData<typeof loader>();
  return (
    <Container className="flex flex-col gap-1">
      <Item label="Övningstyper" to="/exercise-types" icon={faRunning} />
      <Item label="Passmallar" to="/exercise-templates" icon={faList} />
      <Item label="Vikt" to="/weight" icon={faWeight} />
      <Item label="Dagsstatus" to="/day-status" icon={faSquare} />
      <Item label="Regelträning" to="/laws/quiz" icon={faCheck} />
      <Item label="Personliga inställningar" to="/user" icon={faUserCog} />
      <Item label="Anslutningar" to="/connections" icon={faLink} />
      {isAdmin ? (
        <>
          <Separator />
          <Item label="Administration" to="/settings" icon={faUserLock} />
          <Item label="GraphiQL" to="/graphiql" icon={faCode} />
          <Separator />
        </>
      ) : null}
      <Form method="post" action="/logout" className="w-full flex flex-col">
        <Button
          type="submit"
          variant="ghost"
          className="text-red-500 hover:text-red-500 justify-start"
          size="lg"
        >
          <div className="w-8">
            <FontAwesomeIcon icon={faRightFromBracket} />
          </div>{" "}
          Logga ut
        </Button>
      </Form>
    </Container>
  );
}

function Item({
  label,
  icon,
  to,
}: {
  label: string;
  to: string;
  icon: IconDefinition;
}) {
  return (
    <ButtonLink to={to} variant="ghost" size="lg" className="justify-start">
      <div className="w-8">
        <FontAwesomeIcon icon={icon} />
      </div>{" "}
      {label}
    </ButtonLink>
  );
}
