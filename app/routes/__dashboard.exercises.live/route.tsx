import { Box, Container, Heading, Stack } from "@chakra-ui/react";
import type { ActionFunctionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { withZod } from "@remix-validated-form/with-zod";
import { DateTime } from "luxon";
import { ValidatedForm } from "remix-validated-form";
import { z } from "zod";
import { authenticator } from "~/.server/auth.server";
import { SubmitButton } from "~/components/form/submit-button";
import { db } from "~/db.server";
import { HiddenReturnToInput } from "~/services/return-to";

const validator = withZod(z.object({}));

export async function action({ request }: ActionFunctionArgs) {
  const { id: userId } = await authenticator.isAuthenticated(request, {
    failureRedirect: "/",
  });

  const activity = await db.activity.create({
    data: {
      userId,
      time: DateTime.now().toJSDate(),
    },
  });

  return redirect(`/exercises/${activity.id}`);
}

export default function DashboardIndex() {
  return (
    <Container py={5}>
      <ValidatedForm validator={validator} method="post">
        <HiddenReturnToInput />
        <Stack spacing={5}>
          <Heading>Börja träna?</Heading>

          <Box>
            <SubmitButton variant="default">Ja</SubmitButton>
          </Box>
        </Stack>
      </ValidatedForm>
    </Container>
  );
}
