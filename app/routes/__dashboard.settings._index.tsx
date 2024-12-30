import {
  faBook,
  faCode,
  faExclamationTriangle,
  faLink,
  faRunning,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { LoaderFunctionArgs } from "@remix-run/node";
import type { ReactNode } from "react";
import { assertIsAdmin, authenticator } from "~/.server/auth.server";
import { Container } from "~/components/ui/container";
import { InlineLink } from "~/components/ui/inline-link";

export async function loader({ request }: LoaderFunctionArgs) {
  const sessionUser = await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  });
  await assertIsAdmin(sessionUser.id);
  return {};
}

export default function SettingsIndex() {
  return (
    <Container>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        <Item
          to="/settings/purposes"
          icon={<FontAwesomeIcon icon={faRunning} />}
        >
          Träningssyften
        </Item>
        <Item to="/settings/users" icon={<FontAwesomeIcon icon={faUsers} />}>
          Användare
        </Item>
        <Item to="/settings/polar" icon={<FontAwesomeIcon icon={faLink} />}>
          Polar
        </Item>
        <Item to="/debug" icon={<FontAwesomeIcon icon={faCode} />}>
          Debug
        </Item>
        <Item
          to="/settings/notifications"
          icon={<FontAwesomeIcon icon={faExclamationTriangle} />}
        >
          Aviseringar
        </Item>
        <Item to="/settings/laws" icon={<FontAwesomeIcon icon={faBook} />}>
          Regelfrågor
        </Item>
      </div>
    </Container>
  );
}

function Item({
  to,
  children,
  icon,
}: {
  to: string;
  children: ReactNode;
  icon: ReactNode;
}) {
  return (
    <div className="p-5 bg-blue-50 rounded-lg relative">
      <div className="flex flex-col items-center">
        <div className="text-xl">{icon}</div>
        <InlineLink className="after:absolute after:inset-0" to={to}>
          {children}
        </InlineLink>
      </div>
    </div>
  );
}
