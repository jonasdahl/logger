import { exercises } from "./schemas/exercises";

export async function getPolarExercises({
  userId,
  transactionId,
  accessToken,
}: {
  userId: number;
  transactionId: number;
  accessToken: string;
}) {
  const exercisesRes = await fetch(
    `https://www.polaraccesslink.com/v3/users/${userId}/exercise-transactions/${transactionId}`,
    {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  if (exercisesRes.status === 204) {
    return null;
  }

  if (exercisesRes.status !== 200) {
    throw new Error(
      `Failed to get polar exercises, ${exercisesRes.status} ${exercisesRes.statusText}`
    );
  }

  return exercisesRes.json().then((json) => exercises.parse(json));
}
