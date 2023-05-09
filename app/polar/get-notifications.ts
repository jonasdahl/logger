import { z } from "zod";
import { polarClientId, polarClientSecret } from "~/secrets.server";

const responseType = z.object({
  "available-user-data": z.array(
    z.object({
      "user-id": z.number(),
      "data-type": z.union([
        z.string(),
        z.literal("EXERCISE"),
        z.literal("ACTIVITY_SUMMARY"),
      ]),
      url: z.string(),
    })
  ),
});

export async function getPolarNotifications() {
  const res = await fetch("https://www.polaraccesslink.com/v3/notifications", {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Basic ${Buffer.from(
        `${polarClientId}:${polarClientSecret}`,
        "utf-8"
      ).toString("base64")}`,
    },
  });

  if (!res.ok) {
    throw new Error(
      `Could not fetch notifications: ${res.status} ${res.statusText}`
    );
  }

  const jsonData = await res.json();
  const data = responseType.parse(jsonData);

  return data;
}
