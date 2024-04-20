import type { ActionFunctionArgs } from "@remix-run/node";
import { authenticator } from "~/.server/auth.server";

export async function action({ request }: ActionFunctionArgs) {
  await authenticator.logout(request, { redirectTo: "/login" });
}
