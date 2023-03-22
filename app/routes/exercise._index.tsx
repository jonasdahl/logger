import type { LoaderArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { getSessionFromRequest } from "~/session.server";

export async function loader({ request }: LoaderArgs) {
  const data = await getSessionFromRequest(request);
  const polarUserId = data.get("polarUserId");
  const polarAccessToken = data.get("polarAccessToken");

  if (!polarUserId || !polarAccessToken) {
    throw redirect("/");
  }

  const res = await fetch(
    `https://www.polaraccesslink.com/v3/users/${polarUserId}/exercise-transactions`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${polarAccessToken}`,
        Accept: "application/json",
      },
    }
  );

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

  return json({
    data: { status: res.status } as any,
  });
}

export default function Index() {
  const { data } = useLoaderData<typeof loader>();

  return <pre>{JSON.stringify(data)}</pre>;
}
