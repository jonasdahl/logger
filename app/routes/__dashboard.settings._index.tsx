import { Container, Stack } from "@chakra-ui/react";
import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { assertIsAdmin, authenticator } from "~/auth.server";
import { Link } from "~/components/link";

export async function loader({ request }: LoaderArgs) {
  const sessionUser = await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  });
  await assertIsAdmin(sessionUser.id);
  return json({});
}

export default function SettingsIndex() {
  return (
    <Container maxW="container.lg" py={5}>
      <Stack>
        <Link to="/settings/purposes">Träningssyften</Link>
        <Link to="/settings/polar">Polar</Link>
        <Link to="/debug">Debug</Link>
      </Stack>
    </Container>
  );
}
