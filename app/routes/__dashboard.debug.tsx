import { Code, Container, Heading, Stack } from "@chakra-ui/react";
import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { authenticator } from "~/auth.server";
import { db } from "~/db.server";
import { getPolarNotifications } from "~/polar/get-notifications";

export async function loader({ request }: LoaderArgs) {
  const userFromSession = await authenticator.isAuthenticated(request);
  const polarNotifications = await getPolarNotifications();
  const exercises = await db.polarExercise.findMany({});
  return json({
    userFromSession,
    polarNotifications,
    exercises: exercises.map(({ polarId, ...e }) => ({
      polarId: String(polarId),
      ...e,
    })),
  });
}

export default function Debug() {
  const { userFromSession, polarNotifications, exercises } =
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
        <Heading>Polar entries</Heading>
        <Code p={3} overflowX="auto" as="pre">
          {JSON.stringify(exercises, null, 4)}
        </Code>
      </Stack>
    </Container>
  );
}
