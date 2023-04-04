import { createCookieSessionStorage } from "@remix-run/node";
import type { User } from "./auth.server";
import type { FogisClient } from "./fogis/client.server";
import { appSecret } from "./secrets.server";

type SessionData = {
  user?: User;
  fogisGames?: Awaited<ReturnType<FogisClient["getGames"]>>;
};

type SessionFlashData = {
  error: string;
  success?: string;
};

export const session = createCookieSessionStorage<
  SessionData,
  SessionFlashData
>({
  // a Cookie from `createCookie` or the CookieOptions to create one
  cookie: {
    name: "__session",

    // all of these are optional
    // domain: "remix.run",
    // Expires can also be set (although maxAge overrides it when used in combination).
    // Note that this method is NOT recommended as `new Date` creates only one date on each server deployment, not a dynamic date in the future!
    //
    // expires: new Date(Date.now() + 60_000),
    httpOnly: true,
    // maxAge: 60,
    path: "/", // remember to add this so the cookie will work in all routes
    sameSite: "lax",
    secrets: [appSecret],
    secure: process.env.NODE_ENV === "production", // enable this in prod only
  },
});

const { getSession, commitSession, destroySession } = session;

export { getSession, commitSession, destroySession };

export function getSessionFromRequest(request: Request) {
  return getSession(request.headers.get("Cookie"));
}
