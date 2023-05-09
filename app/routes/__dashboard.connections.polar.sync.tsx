import { Container, Heading, Stack } from "@chakra-ui/react";
import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { authenticator } from "~/auth.server";
import { db } from "~/db.server";
import { createExerciseTransaction } from "~/polar/exercise-transaction";
import { getPolarExercise } from "~/polar/get-exercise";
import { getPolarExercises } from "~/polar/get-exercises";

export async function loader({ request }: LoaderArgs) {
  // TODO Move to action

  const { id } = await authenticator.isAuthenticated(request, {
    failureRedirect: "/",
  });

  const { polarAccessToken: accessToken, polarUserId } =
    await db.user.findUniqueOrThrow({
      where: { id },
    });

  if (!accessToken || !polarUserId) {
    throw new Error("Invalid polar user");
  }

  const data = await createExerciseTransaction(
    {
      accessToken,
      userId: polarUserId,
    },
    async ({ transactionId }) => {
      const res = await getPolarExercises({
        accessToken,
        userId: polarUserId,
        transactionId,
      });

      for (const exercise of res?.exercises ?? []) {
        const exerciseId = Number(exercise.match(/\/exercises\/(\d+)$/)?.[1]);

        const details = await getPolarExercise({
          accessToken,
          userId: polarUserId,
          exerciseId: exerciseId,
          transactionId,
        });

        console.log(details);

        const base = {
          raw: JSON.stringify(details),
          startTime: details["start-time"].toJSDate(),
          uploadTime: details["upload-time"].toJSDate(),
          userId: id,
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

  console.log(data);

  return json({ data });
}

export default function SyncPolar() {
  return (
    <Container py={5}>
      <Stack>
        <Heading>Synka</Heading>
      </Stack>
    </Container>
  );
}
