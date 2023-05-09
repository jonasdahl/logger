import { transactionLocation } from "./schemas/transaction-location";

export async function createExerciseTransaction<T>(
  meta: { userId: number; accessToken: string },
  actions: (args: { transactionId: number; resourceUrl: string }) => T
) {
  console.log("Creating transaction");
  const transactionRes = await fetch(
    `https://www.polaraccesslink.com/v3/users/${meta.userId}/exercise-transactions`,
    {
      method: "POST",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${meta.accessToken}`,
      },
    }
  );

  if (transactionRes.status === 204) {
    console.log("No data in transaction");
    return null;
  }

  if (transactionRes.status !== 201) {
    throw new Error("Failed to get transaction");
  }

  const transaction = transactionLocation.parse(await transactionRes.json());
  console.log("transaction", transaction);

  console.log("Executing transaction actions");
  const res = await actions({
    transactionId: transaction["transaction-id"],
    resourceUrl: transaction["resource-uri"],
  });
  console.log("Executing transaction actions done");

  if (process.env.NODE_ENV === "development") {
    console.log("Skipping committing transaction, development mode");
    return res;
  }

  console.log("Committing transaction");
  const commitRes = await fetch(
    `https://www.polaraccesslink.com/v3/users/${meta.userId}/exercise-transactions/${transaction["transaction-id"]}`,
    {
      method: "PUT",
      headers: { Authorization: `Bearer ${meta.accessToken}` },
    }
  );

  if (!commitRes.ok) {
    throw new Error("Failed to commit transaction");
  }
  console.log("Transaction committed");

  return res;
}
