import { Box, Container, Heading, Stack } from "@chakra-ui/react";
import type { ActionFunctionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { useSearchParams } from "@remix-run/react";
import { withZod } from "@remix-validated-form/with-zod";
import { DateTime } from "luxon";
import { ValidatedForm } from "remix-validated-form";
import { z } from "zod";
import { authenticator } from "~/auth.server";
import { Input } from "~/components/form/input";
import { SubmitButton } from "~/components/form/submit-button";
import { validate } from "~/components/form/validate.server";
import { db } from "~/db.server";
import { getTimeZoneFromRequest } from "~/time";

const validator = withZod(z.object({ date: z.string() }));

export async function action({ request }: ActionFunctionArgs) {
  const url = new URL(request.url);
  const { id: userId } = await authenticator.isAuthenticated(request, {
    failureRedirect: "/",
  });
  const data = await validate({ request, validator });
  const timeZone = await getTimeZoneFromRequest(request);
  const time = DateTime.fromFormat(data.date.trim(), "yyyy-MM-dd'T'HH:mm", {
    zone: timeZone,
  });

  await db.physicalTest.create({ data: { time: time.toJSDate(), userId } });

  return redirect(url.searchParams.get("redirectTo") ?? "/");
}

export default function CreateTest() {
  const [searchParams] = useSearchParams();
  const dateFromParams = searchParams.get("date");

  return (
    <Container py={7}>
      <Stack spacing={5}>
        <Heading>Skapa löptest</Heading>
        <ValidatedForm validator={validator} method="post">
          <Stack spacing={5}>
            <Input
              label="Datum"
              type="datetime-local"
              name="date"
              defaultValue={
                dateFromParams ? `${dateFromParams}T12:00` : undefined
              }
            />
            <Box>
              <SubmitButton>Skapa</SubmitButton>
            </Box>
          </Stack>
        </ValidatedForm>
      </Stack>
    </Container>
  );
}
