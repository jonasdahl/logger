import { isAdmin } from "~/auth.server";
import { db } from "~/db.server";
import { notify } from "~/push/notifications.server";
import { createExerciseTransaction } from "./exercise-transaction";
import { getPolarExercise } from "./get-exercise";
import { getPolarExerciseSampleTypes } from "./get-exercise-sample-types";
import { getPolarExerciseSamples } from "./get-exercise-samples";
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

        const { parsed: details, raw } = await getPolarExercise({
          ...meta,
          exerciseId: exerciseId,
          transactionId,
        });

        const sampleTypes = await getPolarExerciseSampleTypes({
          ...meta,
          exerciseId,
          transactionId,
        });

        const sampleRes = await Promise.all(
          sampleTypes.types.map(async (sampleType) => {
            const samples = await getPolarExerciseSamples({
              ...meta,
              exerciseId,
              sampleType,
              transactionId,
            });

            return { sampleType, samples };
          })
        );

        console.log("got samples:", sampleRes);

        const base = {
          raw: JSON.stringify(raw),
          startTime: details.start.toJSDate(),
          uploadTime: details["upload-time"].toJSDate(),
          samples: JSON.stringify(sampleRes),
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

  if (data?.exercises.length || !!(await isAdmin(userId))) {
    const pushes = await db.pushSubscription.findMany({ where: { userId } });
    for (const push of pushes) {
      await notify(
        push,
        "Ett nytt pass från Polar har importerats. Glöm inte att registrera det."
      ).catch((e) => console.error(e));
    }
  }

  return data;
}
