import type { ActionFunctionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { DateTime } from "luxon";
import { z } from "zod";
import { authenticator } from "~/auth.server";
import { db } from "~/db.server";
import { getTimeZoneFromRequest } from "~/time";

export async function action({ request }: ActionFunctionArgs) {
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  });
  const timeZone = getTimeZoneFromRequest(request);

  const formData = await request.formData();
  const day = z
    .string()
    .transform((s) =>
      DateTime.fromFormat(s, "yyyy-MM-dd", { zone: timeZone })
        .startOf("day")
        .set({ hour: 12 })
    )
    .parse(formData.get("day"));
  const rawType = formData.get("type");

  if (rawType === "exercise") {
    await db.plannedActivity.create({
      data: {
        userId: user.id,
        time: day.toJSDate(),
      },
    });
  } else if (rawType === "game") {
    // TODO
  } else if (rawType === "rest") {
    // TODO
  }

  return redirect("/");
}
