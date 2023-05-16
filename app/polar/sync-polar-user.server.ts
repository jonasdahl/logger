import { db } from "~/db.server";
import { createExerciseTransaction } from "./exercise-transaction";
import { getPolarExercise } from "./get-exercise";
import { getPolarExercises } from "./get-exercises";

export async function syncPolarUser({
  polarUserId,
  polarAccessToken,
  userId,
}: {
  polarUserId: number;
  polarAccessToken: string;
  userId: string;
}) {
  const meta = {
    accessToken: polarAccessToken,
    userId: polarUserId,
  };

  console.log("Syncing polar user", polarUserId, "into", userId);

  const data = await createExerciseTransaction(
    meta,
    async ({ transactionId }) => {
      const res = await getPolarExercises({ ...meta, transactionId });

      for (const exercise of res?.exercises ?? []) {
        const exerciseId = Number(exercise.match(/\/exercises\/(\d+)$/)?.[1]);

        const details = await getPolarExercise({
          ...meta,
          exerciseId: exerciseId,
          transactionId,
        });

        console.log(details);

        const base = {
          raw: JSON.stringify(details),
          startTime: details["start-time"].toJSDate(),
          uploadTime: details["upload-time"].toJSDate(),
          userId,
        };

        await db.polarExercise.upsert({
          where: { polarId: exerciseId },
          create: { ...base, polarId: exerciseId },
          update: { ...base },
        });
      }

      return res;
    }
  );

  return data;
}
