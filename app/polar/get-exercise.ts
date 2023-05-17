import { exercise } from "./schemas/exercise";

export async function getPolarExercise({
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
  const exercisesRes = await fetch(
    `https://www.polaraccesslink.com/v3/users/${userId}/exercise-transactions/${transactionId}/exercises/${exerciseId}`,
    {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  if (exercisesRes.status === 204) {
    throw new Error("No data in exercise");
  }

  if (exercisesRes.status !== 200) {
    throw new Error(
      `Failed to get exercise, status ${exercisesRes.status} ${exercisesRes.statusText}`
    );
  }

  return exercisesRes
    .json()
    .then((json) => ({ raw: json, parsed: exercise.parse(json) }));
}
