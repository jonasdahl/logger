import { Button } from "@chakra-ui/react";
import type { IconDefinition } from "@fortawesome/free-solid-svg-icons";
import {
  faCheck,
  faCode,
  faCrosshairs,
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
import { Form, Link, useLoaderData } from "@remix-run/react";
import { authenticator, isAdmin } from "~/.server/auth.server";

export async function loader({ request }: LoaderFunctionArgs) {
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  });
  return json({ isAdmin: await isAdmin(user.id) });
}

export default function Dashboard() {
  const { isAdmin } = useLoaderData<typeof loader>();
  return (
    <div className="flex flex-col gap-3 items-start p-5">
      <Item label="Övningstyper" to="/exercise-types" icon={faRunning} />
      <Item label="Passmallar" to="/exercise-templates" icon={faList} />
      <Item label="Mål" to="/goals" icon={faCrosshairs} />
      <Item label="Vikt" to="/weight" icon={faWeight} />
      <Item label="Dagsstatus" to="/day-status" icon={faSquare} />
      <Item label="Regelträning" to="/laws/quiz" icon={faCheck} />
      <Item label="Personliga inställningar" to="/user" icon={faUserCog} />
      <Item label="Anslutningar" to="/connections" icon={faLink} />
      {isAdmin ? (
        <>
          <hr />
          <Item label="Administration" to="/settings" icon={faUserLock} />
          <Item label="GraphiQL" to="/graphiql" icon={faCode} />
        </>
      ) : null}
      <Form method="post" action="/logout" className="w-full">
        <Button
          type="submit"
          colorScheme="red"
          variant="ghost"
          size="lg"
          w="100%"
          justifyContent="flex-start"
          leftIcon={
            <div className="w-8">
              <FontAwesomeIcon icon={faRightFromBracket} />
            </div>
          }
        >
          Logga ut
        </Button>
      </Form>
    </div>
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
    <Button
      as={Link}
      to={to}
      variant="ghost"
      size="lg"
      w="100%"
      justifyContent="flex-start"
      leftIcon={
        <div className="w-8">
          <FontAwesomeIcon icon={icon} />
        </div>
      }
    >
      {label}
    </Button>
  );
}
