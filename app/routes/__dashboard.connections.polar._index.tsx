import { redirect } from "@remix-run/node";
import { polarClientId, polarRedirectUrl } from "~/secrets.server";

export async function loader() {
  const searchParams = new URLSearchParams();
  searchParams.set("client_id", polarClientId);
  searchParams.set("response_type", "code");
  searchParams.set("scope", "accesslink.read_all");
  searchParams.set("redirect_uri", polarRedirectUrl);

  const url = `https://flow.polar.com/oauth2/authorization?${searchParams.toString()}`;
  console.log("Redirecting to polar:", url);

  return redirect(url);
}
