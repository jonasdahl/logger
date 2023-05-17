import { Alert, Box, Container, Heading, Stack } from "@chakra-ui/react";
import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useLoaderData, useSearchParams } from "@remix-run/react";
import { withZod } from "@remix-validated-form/with-zod";
import { DateTime } from "luxon";
import { ValidatedForm } from "remix-validated-form";
import { z } from "zod";
import { authenticator } from "~/auth.server";
import { Input } from "~/components/form/input";
import { Select } from "~/components/form/select";
import { SubmitButton } from "~/components/form/submit-button";
import { Textarea } from "~/components/form/textarea";
import { validate } from "~/components/form/validate.server";
import { db } from "~/db.server";
import { getTimeZoneFromRequest } from "~/time";

const validator = withZod(
  z.object({
    fromPlannedActivityId: z.string().optional(),
    date: z.string(),
    description: z.string(),
    comment: z.string(),
    primaryPurposeId: z
      .string()
      .transform((s) => (s === "null" ? undefined : s))
      .optional(),
    secondaryPurposeId: z
      .string()
      .transform((s) => (s === "null" ? undefined : s))
      .optional(),
  })
);

export async function action({ request }: ActionArgs) {
  const { id: userId } = await authenticator.isAuthenticated(request, {
    failureRedirect: "/",
  });
  const data = await validate({ request, validator });

  const plannedActivity = data.fromPlannedActivityId
    ? await db.plannedActivity.findFirst({
        where: { id: data.fromPlannedActivityId, userId },
      })
    : null;

  const timeZone = await getTimeZoneFromRequest(request);
  const time = DateTime.fromFormat(data.date.trim(), "yyyy-MM-dd'T'HH:mm", {
    zone: timeZone,
  });

  await db.activity.create({
    data: {
      userId,
      time: time.toJSDate(),
      primaryPurposeId: data.primaryPurposeId,
      secondaryPurposeId: data.secondaryPurposeId,
      description: data.description,
      comment: data.comment,
      fromPlannedActivityId: plannedActivity.id ?? null,
    },
  });
  return redirect(`/days/${DateTime.now().toFormat("yyyy-MM-dd")}`);
}

export async function loader({ request }: LoaderArgs) {
  const userInfo = await authenticator.isAuthenticated(request, {
    failureRedirect: "/",
  });
  const purposes = await db.activityPurpose.findMany({});

  const url = new URL(request.url);
  const plannedActivityId = url.searchParams.get("from");
  const plannedActivity = plannedActivityId
    ? await db.plannedActivity.findFirst({
        where: { id: plannedActivityId, userId: userInfo.id },
      })
    : null;
  const timeZone = await getTimeZoneFromRequest(request);

  return json({ purposes, plannedActivity, timeZone });
}

export default function DashboardIndex() {
  const { purposes, plannedActivity, timeZone } =
    useLoaderData<typeof loader>();
  const [searchParams] = useSearchParams();
  const dateFromParams = searchParams.get("date");

  return (
    <Container py={5}>
      <ValidatedForm validator={validator} method="post">
        <Stack spacing={5}>
          <Heading>Skapa aktivitet</Heading>
          {plannedActivity ? (
            <Box>
              <input
                type="hidden"
                name="fromPlannedActivityId"
                value={plannedActivity.id}
              />
              <Alert>
                Denna aktivitet kommer att kopplas till en planerad aktivitet.
              </Alert>
            </Box>
          ) : null}
          <Input
            label="Datum"
            name="date"
            type="datetime-local"
            defaultValue={
              plannedActivity?.time
                ? DateTime.fromISO(plannedActivity.time)
                    .setZone(timeZone)
                    .toFormat("yyyy-MM-dd'T'HH:mm")
                : dateFromParams
                ? `${dateFromParams}T12:00`
                : undefined
            }
          />
          <Select
            label="Primärt syfte"
            name="primaryPurposeId"
            defaultValue={plannedActivity?.primaryPurposeId ?? undefined}
          >
            <option value="null">Ej valt</option>
            {purposes.map((purpose) => (
              <option key={purpose.id} value={purpose.id}>
                {purpose.label}
              </option>
            ))}
          </Select>
          <Select
            label="Sekundärt syfte"
            name="secondaryPurposeId"
            defaultValue={plannedActivity?.secondaryPurposeId ?? undefined}
          >
            <option value="null">Ej valt</option>
            {purposes.map((purpose) => (
              <option key={purpose.id} value={purpose.id}>
                {purpose.label}
              </option>
            ))}
          </Select>
          <Textarea
            label="Beskrivning/innehåll"
            name="description"
            defaultValue={plannedActivity?.description ?? undefined}
          />
          <Textarea
            label="Övriga kommentarer"
            name="comment"
            defaultValue={plannedActivity?.comment ?? undefined}
          />
          <Box>
            <SubmitButton colorScheme="green">Skapa</SubmitButton>
          </Box>
        </Stack>
      </ValidatedForm>
    </Container>
  );
}
