import type { ActionFunctionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { DateTime } from "luxon";
import { authenticator } from "~/.server/auth.server";
import { db } from "~/db.server";
import { getTimeZoneFromRequest } from "~/time";

export async function action({ request, params }: ActionFunctionArgs) {
  const { id: userId } = await authenticator.isAuthenticated(request, {
    failureRedirect: "/",
  });
  const timeZone = getTimeZoneFromRequest(request);
  const activityId = params.activityId!;

  // Authorization
  const activity = await db.activity.findFirstOrThrow({
    where: { id: activityId, userId },
  });

  await db.activity.update({
    where: { id: activityId },
    data: { isHiddenFromOverview: !activity.isHiddenFromOverview },
  });
  return redirect(
    `/days/${DateTime.fromJSDate(activity.time, { zone: timeZone }).toFormat(
      "yyyy-MM-dd"
    )}`
  );
}
