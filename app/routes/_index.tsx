import type { LoaderArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { DateTime } from "luxon";
import { getTimeZoneFromRequest } from "~/time";

export async function loader({ request }: LoaderArgs) {
  // const today = DateTime.now().setZone(getTimeZoneFromRequest(request));
  // return redirect(`/days/${today.toFormat("yyyy-MM-dd")}`);
  //return redirect("/calendar");
  const timeZone = await getTimeZoneFromRequest(request);
  return redirect(
    `/months/${DateTime.now().setZone(timeZone).toFormat("yyyy'/'MM")}`
  );
}
