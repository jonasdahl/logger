import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { authenticator } from "~/.server/auth.server";
import { H1 } from "~/components/headings";
import { Container } from "~/components/ui/container";
import { db } from "~/db.server";
import { getPolarNotifications } from "~/polar/get-notifications";

export async function loader({ request }: LoaderFunctionArgs) {
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
    <Container className="flex flex-col gap-5">
      <H1>User session object</H1>
      <pre className="p-3 rounded-lg bg-slate-100 border block text-sm overflow-x-auto">
        {JSON.stringify(userFromSession, null, 4)}
      </pre>
      <H1>Polar notifications</H1>
      <pre className="p-3 rounded-lg bg-slate-100 border block text-sm overflow-x-auto">
        {JSON.stringify(polarNotifications, null, 4)}
      </pre>
      <H1>Polar entries</H1>
      <pre className="p-3 rounded-lg bg-slate-100 border block text-sm overflow-x-auto">
        {JSON.stringify(exercises, null, 4)}
      </pre>
    </Container>
  );
}
