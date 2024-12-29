import { Button, Heading } from "@chakra-ui/react";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { Form } from "@remix-run/react";
import { DateTime } from "luxon";
import { authenticator } from "~/.server/auth.server";
import { Container } from "~/components/ui/container";
import { FormStack } from "~/components/ui/form-stack";
import { db } from "~/db.server";
import { getTimeZoneFromRequest } from "~/time";

export async function action({ request, params }: ActionFunctionArgs) {
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

export async function loader({ request, params }: LoaderFunctionArgs) {
  const { id: userId } = await authenticator.isAuthenticated(request, {
    failureRedirect: "/",
  });
  const plannedActivityId = params.plannedActivityId!;

  // Authorization
  const activity = await db.plannedActivity.findFirstOrThrow({
    where: { id: plannedActivityId, userId },
  });

  return { activity };
}

export default function DashboardIndex() {
  return (
    <Container>
      <Form method="post">
        <FormStack>
          <Heading>Radera planerad aktivitet?</Heading>
          <div>
            <Button type="submit" colorScheme="red">
              Radera
            </Button>
          </div>
        </FormStack>
      </Form>
    </Container>
  );
}
