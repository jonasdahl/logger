import type { LoaderArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { z } from "zod";
import { polarClientId, polarClientSecret } from "~/secrets.server";
import { commitSession, getSessionFromRequest } from "~/session.server";

export async function loader({ request }: LoaderArgs) {
  const url = new URL(request.url);
  const authorizationCode = url.searchParams.get("code");
  if (!authorizationCode) {
    throw new Error("No code in response");
  }

  const res = await fetch("https://polarremote.com/v2/oauth2/token", {
    method: "POST",
    body: new URLSearchParams({
      code: authorizationCode,
      grant_type: "authorization_code",
    }),
    headers: {
      Authorization: `Basic ${Buffer.from(
        `${polarClientId}:${polarClientSecret}`,
        "utf-8"
      ).toString("base64")}`,
      "Content-Type": "application/x-www-form-urlencoded",
      Accept: "application/json",
    },
  });
  if (!res.ok) {
    throw new Error("Invalid response");
  }
  const data = z
    .object({ access_token: z.string(), x_user_id: z.number() })
    .parse(await res.json());

  const registerRes = await fetch("https://www.polaraccesslink.com/v3/users", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${data.access_token}`,
    },
    body: JSON.stringify({
      "member-id": `${data.x_user_id}`,
    }),
  });

  // if (!registerRes.ok) {
  //   throw new Error(
  //     `Failed to register user with Polar Access Link: ${registerRes.status} ${
  //       registerRes.statusText
  //     }: ${await registerRes.text()}`
  //   );
  // }

  const session = await getSessionFromRequest(request);
  session.set("polarAccessToken", data.access_token);
  session.set("polarUserId", data.x_user_id);

  return redirect("/", {
    headers: { "Set-Cookie": await commitSession(session) },
  });
}
