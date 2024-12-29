import {
  Alert,
  AlertDescription,
  AlertTitle,
  Heading,
  Stack,
} from "@chakra-ui/react";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { withZod } from "@remix-validated-form/with-zod";
import { ValidatedForm } from "remix-validated-form";
import { z } from "zod";
import { assertIsAdmin, authenticator } from "~/.server/auth.server";
import { SubmitButton } from "~/components/form/submit-button";
import { validate } from "~/components/form/validate.server";
import { ValidatedInputField } from "~/components/form/validated-input-field";
import { Container } from "~/components/ui/container";
import { db } from "~/db.server";

const validator = withZod(
  z.object({
    label: z.string().min(1),
    shortLabel: z.string().max(20),
  })
);

export async function action({ request, params }: ActionFunctionArgs) {
  const sessionUser = await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  });
  await assertIsAdmin(sessionUser.id);

  const { label, shortLabel } = await validate({ request, validator });

  await db.activityPurpose.update({
    where: { id: params.purposeId },
    data: { label, shortLabel },
  });

  return redirect("/settings/purposes");
}

export async function loader({ request, params }: LoaderFunctionArgs) {
  const sessionUser = await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  });
  await assertIsAdmin(sessionUser.id);

  const activityPurpose = await db.activityPurpose.findUniqueOrThrow({
    where: { id: params.purposeId },
  });

  return json({ activityPurpose });
}

export default function PurposeEdit() {
  const { activityPurpose } = useLoaderData<typeof loader>();

  return (
    <Container>
      <Stack spacing={5}>
        <Heading>Ändra "{activityPurpose.label}"</Heading>
        <ValidatedForm validator={validator} method="post">
          <Stack spacing={5}>
            <ValidatedInputField
              label="Namn"
              name="label"
              defaultValue={activityPurpose.label}
            />
            <ValidatedInputField
              label="Förkortat namn"
              name="shortLabel"
              defaultValue={activityPurpose.shortLabel ?? undefined}
            />
            <Alert status="warning">
              <Stack>
                <AlertTitle>Varning!</AlertTitle>
                <AlertDescription>
                  Detta kommer ändra alla tidigare versioner av detta
                  träningssyfte och är till för att rätta stavfel och liknande.
                  Skapa hellre en ny och inaktivera den gamla.
                </AlertDescription>
              </Stack>
            </Alert>
            <div>
              <SubmitButton>Spara</SubmitButton>
            </div>
          </Stack>
        </ValidatedForm>
      </Stack>
    </Container>
  );
}
