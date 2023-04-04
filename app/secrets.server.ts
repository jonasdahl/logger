import { z } from "zod";

const env = z
  .object({
    POLAR_CLIENT_ID: z.string(),
    POLAR_CLIENT_SECRET: z.string(),
    APP_SECRET: z.string(),
  })
  .parse(process.env);

export const polarClientId = env.POLAR_CLIENT_ID;
export const polarClientSecret = env.POLAR_CLIENT_SECRET;
export const appSecret = env.APP_SECRET;
