import type { ActionFunctionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { authenticator } from "~/.server/auth.server";
import { db } from "~/db.server";

export async function action({ request }: ActionFunctionArgs) {
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  });

  const formData = await request.formData();
  const activityId = formData.get("activityId");
  if (!activityId || typeof activityId !== "string") {
    throw new Error("Invalid value");
  }

  const activity = await db.activity.findFirst({
    where: { id: activityId, userId: user.id },
  });

  if (!activity) {
    throw new Error("No such activity");
  }

  await db.activity.update({
    where: { id: activity.id },
    data: { deletedAt: new Date() },
  });

  return redirect("/");
}
