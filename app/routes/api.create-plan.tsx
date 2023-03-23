import { ActivityState, ActivityType } from "@prisma/client";
import type { ActionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { DateTime } from "luxon";
import { z } from "zod";
import { authenticator } from "~/auth.server";
import { db } from "~/db.server";

export async function action({ request }: ActionArgs) {
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  });

  const formData = await request.formData();
  const day = z
    .string()
    .transform((s) => DateTime.fromISO(s).startOf("day"))
    .parse(formData.get("day"));
  const rawType = formData.get("type");
  const type =
    rawType === "exercise"
      ? ActivityType.Exercise
      : rawType === "game"
      ? ActivityType.Game
      : rawType === "rest"
      ? ActivityType.Rest
      : null;

  if (!type) {
    throw new Error("Invalid type");
  }

  await db.activity.create({
    data: {
      state: ActivityState.Planned,
      userId: user.id,
      time: day.toJSDate(),
      type,
    },
  });

  return redirect("/");
}
