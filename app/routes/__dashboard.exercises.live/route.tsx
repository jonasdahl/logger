import type { ActionFunctionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { withZod } from "@remix-validated-form/with-zod";
import { DateTime } from "luxon";
import { ValidatedForm } from "remix-validated-form";
import { z } from "zod";
import { authenticator } from "~/.server/auth.server";
import { SubmitButton } from "~/components/form/submit-button";
import { H1 } from "~/components/headings";
import { db } from "~/db.server";
import { HiddenReturnToInput } from "~/services/return-to";

const validator = withZod(z.object({}));

export async function action({ request }: ActionFunctionArgs) {
  const { id: userId } = await authenticator.isAuthenticated(request, {
    failureRedirect: "/",
  });

  const activity = await db.activity.create({
    data: { userId, time: DateTime.now().toJSDate() },
  });

  return redirect(`/exercises/${activity.id}`);
}

export default function DashboardIndex() {
  return (
    <div className="py-5 container mx-auto px-4 max-w-screen-md">
      <ValidatedForm validator={validator} method="post">
        <HiddenReturnToInput />
        <div className="flex flex-col gap-5">
          <H1>Börja träna?</H1>

          <div>
            <SubmitButton variant="default">Ja</SubmitButton>
          </div>
        </div>
      </ValidatedForm>
    </div>
  );
}
