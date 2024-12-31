import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useLoaderData, useSearchParams } from "@remix-run/react";
import { withZod } from "@remix-validated-form/with-zod";
import { DateTime } from "luxon";
import { ValidatedForm } from "remix-validated-form";
import { z } from "zod";
import { authenticator } from "~/.server/auth.server";
import { ValidatedSelectField } from "~/components/form/select";
import { SubmitButton } from "~/components/form/submit-button";
import { ValidatedTextareaField } from "~/components/form/textarea";
import { validate } from "~/components/form/validate.server";
import { ValidatedInputField } from "~/components/form/validated-input-field";
import { H1 } from "~/components/headings";
import { Alert, AlertDescription } from "~/components/ui/alert";
import { Button } from "~/components/ui/button";
import { FormStack } from "~/components/ui/form-stack";
import { db } from "~/db.server";
import { HiddenReturnToInput } from "~/services/return-to";
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
    returnTo: z.string().optional(),
  })
);

export async function action({ request }: ActionFunctionArgs) {
  const url = new URL(request.url);
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
      fromPlannedActivityId: plannedActivity?.id ?? null,
    },
  });

  const redirectTo =
    data.returnTo ??
    url.searchParams.get("returnTo") ??
    `/days/${DateTime.now().setZone(timeZone).toFormat("yyyy-MM-dd")}`;

  return redirect(redirectTo);
}

export async function loader({ request }: LoaderFunctionArgs) {
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

  const dateFromParams = url.searchParams.get("date");
  const dateStart = dateFromParams
    ? DateTime.fromFormat(dateFromParams, "yyyy-MM-dd", {
        zone: timeZone,
      }).startOf("day")
    : null;
  const polarActivity = await db.polarExercise.findFirst({
    where: {
      userId: userInfo.id,
      startTime: {
        gte: dateStart?.toJSDate(),
        lt: dateStart?.plus({ days: 1 }).toJSDate(),
      },
    },
    orderBy: { startTime: "asc" },
  });

  return json({
    purposes,
    plannedActivity,
    timeZone,
    polarActivityStart: polarActivity?.startTime,
  });
}

export default function DashboardIndex() {
  const { purposes, plannedActivity, timeZone, polarActivityStart } =
    useLoaderData<typeof loader>();
  const [searchParams] = useSearchParams();
  const dateFromParams = searchParams.get("date");

  return (
    <div className="container mx-auto px-4 py-5 max-w-screen-sm">
      <ValidatedForm
        validator={validator}
        method="post"
        defaultValues={{
          date: searchParams.has("now")
            ? DateTime.now().setZone(timeZone).toFormat("yyyy-MM-dd'T'HH:mm")
            : plannedActivity?.time
            ? DateTime.fromISO(plannedActivity.time)
                .setZone(timeZone)
                .toFormat("yyyy-MM-dd'T'HH:mm")
            : polarActivityStart
            ? DateTime.fromISO(polarActivityStart)
                .setZone(timeZone)
                .toFormat("yyyy-MM-dd'T'HH:mm")
            : dateFromParams
            ? `${dateFromParams}T12:00`
            : undefined,
          primaryPurposeId: plannedActivity?.primaryPurposeId ?? undefined,
          secondaryPurposeId: plannedActivity?.secondaryPurposeId ?? undefined,
          description: plannedActivity?.description ?? undefined,
          comment: plannedActivity?.comment ?? undefined,
        }}
      >
        <HiddenReturnToInput />
        <FormStack>
          <H1>Skapa aktivitet</H1>
          {plannedActivity ? (
            <div>
              <input
                type="hidden"
                name="fromPlannedActivityId"
                value={plannedActivity.id}
              />
              <Alert variant="info">
                <AlertDescription>
                  Denna aktivitet kommer att kopplas till en planerad aktivitet.
                </AlertDescription>
              </Alert>
            </div>
          ) : null}
          <div className="flex flex-row gap-2 max-w-full w-full justify-stretch items-end">
            <div className="flex-1 flex-shrink">
              <ValidatedInputField
                label="Datum"
                name="date"
                type="datetime-local"
              />
            </div>
            <div className="flex-0">
              <Button
                type="button"
                onClick={(e) => {
                  e.currentTarget.form!.date.value = DateTime.now()
                    .setZone(timeZone)
                    .toFormat("yyyy-MM-dd'T'HH:mm");
                }}
                variant="outline"
              >
                Nu
              </Button>
            </div>
          </div>
          <ValidatedSelectField
            label="Primärt syfte"
            name="primaryPurposeId"
            options={[
              { value: "null", label: "Ej valt" },
              ...purposes.map((purpose) => ({
                value: purpose.id,
                label: purpose.label,
              })),
            ]}
          />
          <ValidatedSelectField
            label="Sekundärt syfte"
            name="secondaryPurposeId"
            options={[
              { value: "null", label: "Ej valt" },
              ...purposes.map((purpose) => ({
                value: purpose.id,
                label: purpose.label,
              })),
            ]}
          />
          <ValidatedTextareaField
            label="Beskrivning/innehåll"
            name="description"
          />
          <ValidatedTextareaField label="Övriga kommentarer" name="comment" />
          <div>
            <SubmitButton>Skapa</SubmitButton>
          </div>
        </FormStack>
      </ValidatedForm>
    </div>
  );
}
