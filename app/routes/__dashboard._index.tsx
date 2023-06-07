import { redirect } from "@remix-run/node";
import { DateTime } from "luxon";

export async function loader() {
  const today = DateTime.now().setZone("Europe/Stockholm");
  return redirect(`/days/${today.toFormat("yyyy-MM-dd")}`);
}
