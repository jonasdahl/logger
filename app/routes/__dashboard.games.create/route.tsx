import type { ActionFunctionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { useSearchParams } from "@remix-run/react";
import { withZod } from "@remix-validated-form/with-zod";
import { DateTime } from "luxon";
import { ValidatedForm } from "remix-validated-form";
import { z } from "zod";
import { authenticator } from "~/.server/auth.server";
import { SubmitButton } from "~/components/form/submit-button";
import { validate } from "~/components/form/validate.server";
import { ValidatedInputField } from "~/components/form/validated-input-field";
import { H1 } from "~/components/headings";
import { Container } from "~/components/ui/container";
import { FormStack } from "~/components/ui/form-stack";
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

  await db.customGame.create({ data: { time: time.toJSDate(), userId } });

  return redirect(url.searchParams.get("redirectTo") ?? "/");
}

export default function CreateTest() {
  const [searchParams] = useSearchParams();
  const dateFromParams = searchParams.get("date");

  return (
    <Container className="flex flex-col gap-5">
      <H1>Skapa match</H1>
      <ValidatedForm validator={validator} method="post">
        <FormStack>
          <ValidatedInputField
            label="Datum"
            type="datetime-local"
            name="date"
            defaultValue={
              dateFromParams ? `${dateFromParams}T12:00` : undefined
            }
          />
          <div>
            <SubmitButton>Skapa</SubmitButton>
          </div>
        </FormStack>
      </ValidatedForm>
    </Container>
  );
}
