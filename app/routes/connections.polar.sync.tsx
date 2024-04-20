import type { ActionFunctionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { authenticator } from "~/.server/auth.server";
import { db } from "~/db.server";
import { syncPolarUser } from "~/polar/sync-polar-user.server";

export async function action({ request }: ActionFunctionArgs) {
  const { id } = await authenticator.isAuthenticated(request, {
    failureRedirect: "/",
  });

  const { polarAccessToken, polarUserId } = await db.user.findUniqueOrThrow({
    where: { id },
  });

  if (!polarAccessToken || !polarUserId) {
    throw new Error("Invalid polar user");
  }

  await syncPolarUser({ polarAccessToken, polarUserId, userId: id });

  return redirect("/connections?success");
}
