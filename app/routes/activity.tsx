import type { LoaderArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { z } from "zod";
import { getSessionFromRequest } from "~/session.server";

export async function loader({ request }: LoaderArgs) {
  const sessionData = await getSessionFromRequest(request);
  const polarUserId = sessionData.get("polarUserId");
  const polarAccessToken = sessionData.get("polarAccessToken");

  if (!polarUserId || !polarAccessToken) {
    throw redirect("/");
  }

  const res = await fetch(
    `https://www.polaraccesslink.com/v3/users/${polarUserId}/activity-transactions`,
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

  if (res.status === 204) {
    throw new Error("No new data");
  }

  const createdTransaction = z
    .object({
      "transaction-id": z.number(),
      "resource-uri": z.string(),
    })
    .parse(await res.json());

  const activitiesRes = await fetch(
    `https://www.polaraccesslink.com/v3/users/${polarUserId}/activity-transactions/${createdTransaction["transaction-id"]}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${polarAccessToken}`,
        Accept: "application/json",
      },
    }
  );
  if (!activitiesRes.ok) {
    throw new Error(
      `Invalid response: ${res.status} ${res.statusText} ${await res.text()}`
    );
  }

  if (activitiesRes.status === 204) {
    throw new Error("No new activity data");
  }

  const activities = z
    .object({
      "activity-log": z.array(z.string()),
    })
    .parse(await activitiesRes.json());

  const commitRes = await fetch(
    `https://www.polaraccesslink.com/v3/users/${polarUserId}/activity-transactions/${createdTransaction["transaction-id"]}`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${polarAccessToken}`,
        Accept: "application/json",
      },
    }
  );
  if (!commitRes.ok) {
    throw new Error(
      `Failed to commit: ${res.status} ${res.statusText} ${await res.text()}`
    );
  }

  if (commitRes.status === 204) {
    throw new Error("No new activity data");
  }

  return json({
    createdTransaction,
    activities,
  });
}

export default function Index() {
  const data = useLoaderData<typeof loader>();

  return <pre>{JSON.stringify(data, null, 4)}</pre>;
}
