import { Button } from "@chakra-ui/react";
import type { IconDefinition } from "@fortawesome/free-solid-svg-icons";
import { faCheck, faRunning } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link } from "@remix-run/react";
import { authenticator } from "~/.server/auth.server";

export async function loader({ request }: LoaderFunctionArgs) {
  await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  });
  return json({});
}

export default function Dashboard() {
  return (
    <div className="flex flex-col gap-3 items-start p-5">
      <Item label="Övningstyper" to="/exercise-types" icon={faRunning} />
      <Item label="Regelträning" to="/laws/quiz" icon={faCheck} />
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
