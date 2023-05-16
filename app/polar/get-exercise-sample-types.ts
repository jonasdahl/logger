import { samples } from "./schemas/samples";

export async function getPolarExerciseSampleTypes({
  userId,
  transactionId,
  exerciseId,
  accessToken,
}: {
  userId: number;
  transactionId: number;
  exerciseId: number;
  accessToken: string;
}) {
  const res = await fetch(
    `https://www.polaraccesslink.com/v3/users/${userId}/exercise-transactions/${transactionId}/exercises/${exerciseId}/samples`,
    {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  if (res.status === 204) {
    throw new Error("No sample data in exercise");
  }

  if (res.status !== 200) {
    throw new Error(
      `Failed to get exercise, status ${res.status} ${res.statusText}`
    );
  }

  return res
    .json()
    .then((json) => samples.parse(json))
    .then((data) => {
      return {
        samples: data.samples,
        types: data.samples.map((url) => url.split("/").pop()!),
      };
    });
}
