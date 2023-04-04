export const polarClientId = process.env.POLAR_CLIENT_ID;
export const polarClientSecret = process.env.POLAR_CLIENT_SECRET;
if (!process.env.APP_SECRET) {
  throw new Error("APP_SECRET is not set");
}
export const appSecret = process.env.APP_SECRET;
