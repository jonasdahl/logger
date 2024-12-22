import { redirect } from "@remix-run/node";

export function redirectBack(fallback: string, request: Request) {
  const referer = request.headers.get("Referer");
  return redirect(referer || fallback);
}
