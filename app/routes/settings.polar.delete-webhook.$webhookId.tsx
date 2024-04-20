import type { ActionFunctionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { z } from "zod";
import { assertIsAdmin, authenticator } from "~/.server/auth.server";
import { polarClientId, polarClientSecret } from "~/secrets.server";

export async function action({ request, params }: ActionFunctionArgs) {
  const sessionUser = await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  });
  await assertIsAdmin(sessionUser.id);

  const { webhookId } = z.object({ webhookId: z.string() }).parse(params);

  const res = await fetch(
    `https://www.polaraccesslink.com/v3/webhooks/${webhookId}`,
    {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        Authorization: `Basic ${Buffer.from(
          `${polarClientId}:${polarClientSecret}`,
          "utf-8"
        ).toString("base64")}`,
      },
    }
  );

  if (!res.ok) {
    throw new Error(`Not ok: ${res.status}`);
  }

  return redirect("/settings/polar");
}
