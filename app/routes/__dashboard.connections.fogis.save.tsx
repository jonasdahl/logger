import { RefereeRole } from "@prisma/client";
import type { ActionFunctionArgs, SerializeFrom } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { DateTime } from "luxon";
import { z } from "zod";
import { authenticator } from "~/auth.server";
import { db } from "~/db.server";
import type { FogisGameType } from "~/fogis/parseGamesFromTableRows";
import { commitSession, getSessionFromRequest } from "~/session.server";

export async function action({ request }: ActionFunctionArgs) {
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  });

  const formData = await request.formData();

  const toDeleteIds = formData.getAll("delete").map((d) => z.string().parse(d));
  const toAddIds = formData.getAll("add").map((d) => z.string().parse(d));
  const toAdd = toAddIds
    .map((id) => formData.get(`toAdd[${id}]`))
    .map((gameJson) => {
      return JSON.parse(gameJson as string) as SerializeFrom<FogisGameType>;
    });

  const createRes = await db.fogisGame.createMany({
    data: toAdd.map((game) => ({
      gameId: game.id,
      userId: user.id,
      time: DateTime.fromISO(game.time!).toJSDate(),
      homeTeam: game.homeTeam.name,
      awayTeam: game.awayTeam.name,
      facility: game.location.name,
      positionLatitude: game.location.position?.latitude ?? null,
      positionLongitude: game.location.position?.longitude ?? null,
      role: RefereeRole.Assistant,
    })),
  });

  const deleteRes = await db.fogisGame.updateMany({
    where: { userId: user.id, id: { in: toDeleteIds } },
    data: { deletedAt: new Date() },
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
