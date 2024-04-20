import type { LoaderFunctionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { z } from "zod";
import { authenticator } from "~/.server/auth.server";
import { db } from "~/db.server";
import {
  polarClientId,
  polarClientSecret,
  polarRedirectUrl,
} from "~/secrets.server";
import { commitSession, getSessionFromRequest } from "~/session.server";

export async function loader({ request }: LoaderFunctionArgs) {
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  });

  const url = new URL(request.url);
  const authorizationCode = url.searchParams.get("code");
  if (!authorizationCode) {
    throw new Error("No code in response");
  }

  console.log("Getting token for code", authorizationCode);

  const res = await fetch("https://polarremote.com/v2/oauth2/token", {
    method: "POST",
    body: new URLSearchParams({
      code: authorizationCode,
      grant_type: "authorization_code",
      redirect_uri: polarRedirectUrl,
    }).toString(),
    headers: {
      Authorization: `Basic ${Buffer.from(
        `${polarClientId}:${polarClientSecret}`,
        "utf-8"
      ).toString("base64")}`,
      "Content-Type": "application/x-www-form-urlencoded",
      Accept: "application/json;charset=UTF-8",
    },
  });

  if (!res.ok) {
    console.error(
      "Invalid response from Polar Token Endpoint",
      res.status,
      res.statusText,
      await res.text()
    );
    throw redirect("/dashboard/connections?error=invalid_response");
  }

  const json = await res.json();
  console.log("token data", json);
  const value = z
    .object({
      access_token: z.string(),
      x_user_id: z.number(),
      expires_in: z.number(),
    })
    .safeParse(json);

  if (!value.success) {
    console.error("Invalid JSON from Polar Token Endpoint", value.error);
    throw redirect("/dashboard/connections?error=invalid_token");
  }

  const data = value.data;

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

  const updatedUser = await db.user.update({
    data: {
      polarUserId: data.x_user_id,
      polarAccessToken: data.access_token,
    },
    where: { id: user.id },
  });

  session.set(authenticator.sessionKey as any, updatedUser);

  return redirect("/connections?success", {
    headers: { "Set-Cookie": await commitSession(session) },
  });
}
