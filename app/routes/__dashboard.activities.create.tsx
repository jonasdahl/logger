import { Box, Container, Heading, Stack } from "@chakra-ui/react";
import { ActivityState, ActivityType } from "@prisma/client";
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

const validator = withZod(
  z.object({
    date: z
      .string()
      .transform((s) => DateTime.fromFormat(s.trim(), "yyyy-MM-dd'T'HH:mm")),
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
  await db.activity.create({
    data: {
      userId,
      type: ActivityType.Exercise,
      state: ActivityState.Registered,
      time: data.date.toJSDate(),
      primaryPurposeId: data.primaryPurposeId,
      secondaryPurposeId: data.secondaryPurposeId,
      description: data.description,
      comment: data.comment,
    },
  });
  return redirect(`/days/${DateTime.now().toFormat("yyyy-MM-dd")}`);
}

export async function loader({ request }: LoaderArgs) {
  const purposes = await db.activityPurpose.findMany({});

  return json({ purposes });
}

export default function DashboardIndex() {
  const { purposes } = useLoaderData<typeof loader>();
  const [searchParams] = useSearchParams();
  const dateFromParams = searchParams.get("date");

  return (
    <Container py={5}>
      <ValidatedForm validator={validator} method="post">
        <Stack spacing={5}>
          <Heading>Skapa aktivitet</Heading>
          <Input
            label="Datum"
            name="date"
            type="datetime-local"
            defaultValue={
              dateFromParams ? `${dateFromParams}T12:00` : undefined
            }
          />
          <Select label="Primärt syfte" name="primaryPurposeId">
            <option value="null">Ej valt</option>
            {purposes.map((purpose) => (
              <option key={purpose.id} value={purpose.id}>
                {purpose.label}
              </option>
            ))}
          </Select>
          <Select label="Sekundärt syfte" name="secondaryPurposeId">
            <option value="null">Ej valt</option>
            {purposes.map((purpose) => (
              <option key={purpose.id} value={purpose.id}>
                {purpose.label}
              </option>
            ))}
          </Select>
          <Textarea label="Beskrivning/innehåll" name="description" />
          <Textarea label="Övriga kommentarer" name="comment" />
          <Box>
            <SubmitButton colorScheme="green">Skapa</SubmitButton>
          </Box>
        </Stack>
      </ValidatedForm>
    </Container>
  );
}
