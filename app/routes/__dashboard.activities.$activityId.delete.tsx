import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form } from "@remix-run/react";
import { DateTime } from "luxon";
import { authenticator } from "~/.server/auth.server";
import { H1 } from "~/components/headings";
import { Button } from "~/components/ui/button";
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
    data: { deletedAt: new Date() },
  });
  return redirect(
    `/days/${DateTime.fromJSDate(activity.time, { zone: timeZone }).toFormat(
      "yyyy-MM-dd"
    )}`
  );
}

export async function loader({ request, params }: LoaderFunctionArgs) {
  const { id: userId } = await authenticator.isAuthenticated(request, {
    failureRedirect: "/",
  });
  const activityId = params.activityId!;

  // Authorization
  const activity = await db.activity.findFirstOrThrow({
    where: { id: activityId, userId },
  });

  return json({ activity });
}

export default function DashboardIndex() {
  return (
    <div className="container mx-auto max-w-screen-md px-4 py-5">
      <Form method="post">
        <div className="flex flex-col gap-5">
          <H1>Radera registrerad aktivitet?</H1>
          <div>
            <Button type="submit" variant="destructive">
              Radera
            </Button>
          </div>
        </div>
      </Form>
    </div>
  );
}
