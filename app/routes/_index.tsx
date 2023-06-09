import { redirect } from "@remix-run/node";

export async function loader() {
  // const today = DateTime.now().setZone(getTimeZoneFromRequest(request));
  // return redirect(`/days/${today.toFormat("yyyy-MM-dd")}`);
  return redirect("/calendar");
}
