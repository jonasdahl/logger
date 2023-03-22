import { z } from "zod";
import { polarClientId, polarClientSecret } from "~/secrets.server";

async function run({ accessToken }: { accessToken: string }) {
  const client = new PolarClient({
    auth: {
      accessToken,
      clientId: polarClientId,
      clientSecret: polarClientSecret,
    },
  });

  await client.registerUser("123");

  const activities = await client.activityTransaction("123", (transaction) => {
    return transaction.listActivities();
  });

  console.log(activities);
}

class PolarClient {
  accessToken: string;
  clientId: string;
  clientSecret: string;

  constructor({
    auth,
  }: {
    auth: {
      accessToken: string;
      clientId: string;
      clientSecret: string;
    };
  }) {
    this.accessToken = auth.accessToken;
    this.clientId = auth.clientId;
    this.clientSecret = auth.clientSecret;
  }

  async registerUser(userId: string) {
    const res = await fetch("https://api.polaraccesslink.com/v3/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${this.accessToken}`,
      },
      body: JSON.stringify({ "member-id": `${userId}` }),
    });
    if (!res.ok) {
      throw new Error(
        `Failed to register user with Polar Access Link: ${res.status} ${
          res.statusText
        }: ${await res.text()}`
      );
    }
    return true;
  }

  async activityTransaction<TReturn>(
    userId: string,
    transaction: (transaction: PolarActivityTransaction) => Promise<TReturn>
  ) {
    const res = await fetch(
      `https://api.polaraccesslink.com/v3/users/${userId}/activity-transactions`,
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${this.accessToken}`,
        },
      }
    );
    const { "transaction-id": transactionId } = z
      .object({ "transaction-id": z.number(), "resource-uri": z.string() })
      .parse(await res.json());
    const result = await transaction(
      new PolarActivityTransaction({ transactionId, userId, client: this })
    );
    await fetch(
      `https://api.polaraccesslink.com/v3/users/${userId}/activity-transactions/${transactionId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${this.accessToken}`,
        },
      }
    );
    return result;
  }
}

export class PolarActivityTransaction {
  transactionId: number;
  client: PolarClient;
  userId: string;

  constructor({
    transactionId,
    userId,
    client,
  }: {
    transactionId: number;
    userId: string;
    client: PolarClient;
  }) {
    this.transactionId = transactionId;
    this.client = client;
    this.userId = userId;
  }

  async listActivities() {
    const res = await fetch(
      `https://api.polaraccesslink.com/v3/users/${this.client.userId}/activity-transactions/${this.transactionId}/activities`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${this.client.accessToken}`,
        },
      }
    );

    const json = await res.json();
    const data = z.object({ "activity-log": z.array(z.string()) }).parse(json);

    return data;
  }
}
