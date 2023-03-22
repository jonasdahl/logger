import { Stack } from "@chakra-ui/react";
import type { LoaderArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { DateTime } from "luxon";
import { z } from "zod";
import { getSessionFromRequest } from "~/session.server";

export async function loader({ request }: LoaderArgs) {
  const session = await getSessionFromRequest(request);
  const polarUserId = session.get("polarUserId");
  const polarAccessToken = session.get("polarAccessToken");

  if (!polarUserId || !polarAccessToken) {
    throw redirect("/");
  }

  const res = await fetch(`https://www.polaraccesslink.com/v3/exercises`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${polarAccessToken}`,
      Accept: "application/json",
    },
  });

  if (res.status === 401) {
    return redirect("/auth/polar");
  }

  if (res.status === 403) {
    throw new Response(undefined, { status: 403 });
  }

  if (!res.ok) {
    throw new Error(
      `Invalid response: ${res.status} ${res.statusText} ${await res.text()}`
    );
  }

  const exercises = z
    .array(
      z.object({
        id: z.string(),
        start_time: z.string().transform((s) => DateTime.fromISO(s)),
      })
    )
    .parse(await res.json());

  return json({ exercises });
}

export default function Index() {
  const { exercises } = useLoaderData<typeof loader>();

  return (
    <Stack>
      {exercises.map((exercise) => (
        <Link key={exercise.id} to={`./${exercise.id}`}>
          {DateTime.fromISO(exercise.start_time).toFormat("yyyy-MM-dd HH:mm")}
        </Link>
      ))}
    </Stack>
  );
}
