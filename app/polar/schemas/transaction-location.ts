import { z } from "zod";

export const transactionLocation = z.object({
  "transaction-id": z.number(),
  "resource-uri": z.string(),
});
