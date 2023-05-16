import type { ActionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { DateTime } from "luxon";
import { z } from "zod";
import { authenticator } from "~/auth.server";
import { db } from "~/db.server";
import { commitSession, getSessionFromRequest } from "~/session.server";

export async function action({ request }: ActionArgs) {
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  });

  const formData = await request.formData();

  const toDeleteIds = formData.getAll("delete").map((d) => z.string().parse(d));
  const toAddIds = formData.getAll("add").map((d) => z.string().parse(d));
  const toAdd = toAddIds
    .map((id) => formData.get(`toAdd[${id}]`))
    .map((gameJson) => {
      const data = z
        .object({
          id: z.string(),
          time: z.string().transform((s) => DateTime.fromISO(s)),
        })
        .parse(JSON.parse(gameJson as string));
      return {
        providerId: data.id,
        time: data.time,
      };
    });

  const createRes = await db.game.createMany({
    data: toAdd.map((game) => ({
      provider: "fogisImport",
      providerId: game.providerId,
      userId: user.id,
      time: game.time.toJSDate(),
    })),
  });

  const deleteRes = await db.game.updateMany({
    where: {
      provider: "fogisImport",
      userId: user.id,
      id: { in: toDeleteIds },
    },
    data: {
      deletedAt: new Date(),
    },
  });

  await db.user.update({
    where: { id: user.id },
    data: { lastFogisSync: new Date() },
  });

  const session = await getSessionFromRequest(request);
  session.flash(
    "success",
    `${deleteRes.count} matcher togs bort. ${createRes.count} matcher skapades.`
  );

  return redirect("/connections", {
    headers: { "Set-Cookie": await commitSession(session) },
  });
}
