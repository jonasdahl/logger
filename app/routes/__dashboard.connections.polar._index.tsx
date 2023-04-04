import { redirect } from "@remix-run/node";
import { polarClientId } from "~/secrets.server";

export async function loader() {
  return redirect(
    `https://flow.polar.com/oauth2/authorization?response_type=code&client_id=${polarClientId}&scope=accesslink.read_all`
  );
}
