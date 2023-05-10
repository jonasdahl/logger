import { Container } from "@chakra-ui/react";
import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { authenticator } from "~/auth.server";
import { Link } from "~/components/link";
import { db } from "~/db.server";

export async function loader({ request }: LoaderArgs) {
  const sessionUser = await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  });
  const user = await db.user.findUniqueOrThrow({
    where: { id: sessionUser.id },
  });
  if (user.email !== "jonas@jdahl.se") {
    throw new Error("Invalid user");
  }

  return json({});
}

export default function SettingsIndex() {
  return (
    <Container maxW="container.lg" py={5}>
      <Link to="/settings/purposes">Träningssyften</Link>
    </Container>
  );
}
