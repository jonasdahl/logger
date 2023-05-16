import { Code, Container, Heading, Stack } from "@chakra-ui/react";
import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { authenticator } from "~/auth.server";
import { db } from "~/db.server";

export async function loader({ request, params }: LoaderArgs) {
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: "/connections",
  });

  const exercise = await db.polarExercise.findFirstOrThrow({
    where: { userId: user.id, id: params.exerciseId },
  });

  return json({ exercise });
}

export default function PolarExercise() {
  const { exercise } = useLoaderData<typeof loader>();
  return (
    <Container py={5} maxW="container.lg">
      <Stack>
        <Heading>Träning från Polar</Heading>
        <Code as="pre" p={3} overflowX="auto">
          {JSON.stringify(exercise, null, 4)}
        </Code>
        <Heading>Raw</Heading>
        <Code as="pre" p={3} overflowX="auto">
          {JSON.stringify(JSON.parse(exercise.raw), null, 4)}
        </Code>
      </Stack>
    </Container>
  );
}
