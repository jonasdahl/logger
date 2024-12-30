import type { LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { withZod } from "@remix-validated-form/with-zod";
import { ValidatedForm } from "remix-validated-form";
import { z } from "zod";
import { assertIsAdmin, authenticator } from "~/.server/auth.server";
import { SubmitButton } from "~/components/form/submit-button";
import { ValidatedTextareaField } from "~/components/form/textarea";
import { validate } from "~/components/form/validate.server";
import { H1 } from "~/components/headings";
import { Container } from "~/components/ui/container";
import { FormStack } from "~/components/ui/form-stack";
import { db } from "~/db.server";

const validator = withZod(
  z.object({
    entries: z.string().transform((s) =>
      s
        .split("\n")
        .map((x) => x.trim())
        .filter((x) => !!x)
    ),
  })
);

export async function action({ request }: LoaderFunctionArgs) {
  const sessionUser = await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  });
  await assertIsAdmin(sessionUser.id);
  const data = await validate({ request, validator });

  await db.activityPurpose.createMany({
    data: data.entries.map((i) => ({ label: i })),
  });

  return redirect("/settings/purposes");
}

export async function loader({ request }: LoaderFunctionArgs) {
  const sessionUser = await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  });
  await assertIsAdmin(sessionUser.id);
  return json({});
}

export default function SettingsIndex() {
  return (
    <Container className="flex flex-col gap-5">
      <H1>Skapa träningssyften</H1>

      <div>Lägg till en per rad nedan</div>

      <ValidatedForm validator={validator} method="post">
        <FormStack>
          <ValidatedTextareaField
            label="Träningssyften (ett per rad)"
            name="entries"
          />
          <div>
            <SubmitButton>Skapa</SubmitButton>
          </div>
        </FormStack>
      </ValidatedForm>
    </Container>
  );
}
