import { sample } from "./schemas/sample";

export async function getPolarExerciseSamples({
  userId,
  transactionId,
  exerciseId,
  accessToken,
  sampleType,
}: {
  userId: number;
  transactionId: number;
  exerciseId: number;
  accessToken: string;
  sampleType: string;
}) {
  const url = `https://www.polaraccesslink.com/v3/users/${userId}/exercise-transactions/${transactionId}/exercises/${exerciseId}/samples/${sampleType}`;
  console.log("Getting samples", url);
  const res = await fetch(url, {
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (res.status === 204) {
    throw new Error("No sample data in exercise samples");
  }

  if (res.status !== 200) {
    throw new Error(
      `Failed to get exercise samples for type ${sampleType}, status ${res.status} ${res.statusText}`
    );
  }

  return res.json().then((json) => sample.parse(json));
}
