import type { ActionFunctionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { authenticator } from "~/.server/auth.server";
import { db } from "~/db.server";

export async function action({ request, params }: ActionFunctionArgs) {
  const url = new URL(request.url);
  const { id: userId } = await authenticator.isAuthenticated(request, {
    failureRedirect: "/",
  });

  const previousGoal = await db.goal.findFirstOrThrow({
    where: { id: params.goalId!, userId },
  });

  await db.goal.delete({ where: { id: previousGoal.id } });
  return redirect(url.searchParams.get("redirectTo") ?? "/");
}
