import { createCookieSessionStorage } from "@remix-run/node";

// export the whole sessionStorage object
export const authSessionStorage = createCookieSessionStorage({
  cookie: {
    name: "__user", // use any name you want here
    sameSite: "lax", // this helps with CSRF
    path: "/", // remember to add this so the cookie will work in all routes
    httpOnly: true, // for security reasons, make this cookie http only
    secrets: ["3f7c2d02-b511-4165-a99b-bdc22476f7b6"], // replace this with an actual secret
    secure: process.env.NODE_ENV === "production", // enable this in prod only
  },
});

type SessionData = {
  polarAccessToken: string | undefined;
  polarUserId: number | undefined;
};

type SessionFlashData = {
  error: string;
};

const { getSession, commitSession, destroySession } =
  createCookieSessionStorage<SessionData, SessionFlashData>({
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
      // path: "/",
      sameSite: "lax",
      secrets: ["b0676b85-7308-4e6e-86b2-a313c418cb61"],
      secure: true,
    },
  });

export { getSession, commitSession, destroySession };

export function getSessionFromRequest(request: Request) {
  return getSession(request.headers.get("Cookie"));
}
