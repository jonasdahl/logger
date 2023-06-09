import { z } from "zod";

const env = z
  .object({
    POLAR_CLIENT_ID: z.string(),
    POLAR_CLIENT_SECRET: z.string(),
    APP_SECRET: z.string(),
    VAPID_PUBLIC: z.string(),
    VAPID_PRIVATE: z.string(),
  })
  .parse(process.env);

export const polarClientId = env.POLAR_CLIENT_ID;
export const polarClientSecret = env.POLAR_CLIENT_SECRET;
export const polarRedirectUrl =
  process.env.NODE_ENV === "development"
    ? "http://localhost:3000/connections/polar/auth-callback"
    : "https://log.jdahl.se/connections/polar/auth-callback";
export const appSecret = env.APP_SECRET;
export const vapidKeys = {
  publicKey: env.VAPID_PUBLIC,
  privateKey: env.VAPID_PRIVATE,
};
