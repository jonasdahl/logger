import { Code, Container, Heading, Stack } from "@chakra-ui/react";
import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { authenticator } from "~/auth.server";
import { getPolarNotifications } from "~/polar/get-notifications";

export async function loader({ request }: LoaderArgs) {
  const userFromSession = await authenticator.isAuthenticated(request);
  const polarNotifications = await getPolarNotifications();
  return json({
    userFromSession,
    polarNotifications,
  });
}

export default function Debug() {
  const { userFromSession, polarNotifications } =
    useLoaderData<typeof loader>();
  return (
    <Container>
      <Stack spacing={5} py={5}>
        <Heading>User session object</Heading>
        <Code p={3} overflowX="auto" as="pre">
          {JSON.stringify(userFromSession, null, 4)}
        </Code>
        <Heading>Polar notifications</Heading>
        <Code p={3} overflowX="auto" as="pre">
          {JSON.stringify(polarNotifications, null, 4)}
        </Code>
      </Stack>
    </Container>
  );
}
