import { Box, Button, Container, Heading, Stack } from "@chakra-ui/react";
import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form } from "@remix-run/react";
import { DateTime } from "luxon";
import { authenticator } from "~/auth.server";
import { db } from "~/db.server";
import { getTimeZoneFromRequest } from "~/time";

export async function action({ request, params }: ActionArgs) {
  const { id: userId } = await authenticator.isAuthenticated(request, {
    failureRedirect: "/",
  });
  const timeZone = getTimeZoneFromRequest(request);
  const plannedActivityId = params.plannedActivityId!;

  // Authorization
  const activity = await db.plannedActivity.findFirstOrThrow({
    where: { id: plannedActivityId, userId },
  });

  await db.plannedActivity.update({
    where: { id: plannedActivityId },
    data: { deletedAt: new Date() },
  });
  return redirect(
    `/days/${DateTime.fromJSDate(activity.time, { zone: timeZone }).toFormat(
      "yyyy-MM-dd"
    )}`
  );
}

export async function loader({ request, params }: LoaderArgs) {
  const { id: userId } = await authenticator.isAuthenticated(request, {
    failureRedirect: "/",
  });
  const plannedActivityId = params.plannedActivityId!;

  // Authorization
  const activity = await db.plannedActivity.findFirstOrThrow({
    where: { id: plannedActivityId, userId },
  });

  return json({ activity });
}

export default function DashboardIndex() {
  return (
    <Container py={5}>
      <Form method="post">
        <Stack spacing={5}>
          <Heading>Radera planerad aktivitet?</Heading>
          <Box>
            <Button type="submit" colorScheme="red">
              Radera
            </Button>
          </Box>
        </Stack>
      </Form>
    </Container>
  );
}
