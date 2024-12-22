import type { ActionFunctionArgs } from "@remix-run/node";
import { withZod } from "@remix-validated-form/with-zod";
import type { ReactNode } from "react";
import { ValidatedForm } from "remix-validated-form";
import { z } from "zod";
import { authenticator } from "~/.server/auth.server";
import { Input } from "~/components/form/input";
import { validate } from "~/components/form/validate.server";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { FormStack } from "~/components/ui/form-stack";
import { db } from "~/db.server";
import { redirectBack } from "~/lib/redirect-back";

export async function action({ request, params }: ActionFunctionArgs) {
  const { id: userId } = await authenticator.isAuthenticated(request, {
    failureRedirect: "/",
  });

  const { name } = await validate({ request, validator });

  await db.categoryTag.create({
    data: { name, userId },
  });

  return redirectBack("/", request);
}

const validator = withZod(z.object({ name: z.string() }));

export function CreateTagModal({ trigger }: { trigger: ReactNode }) {
  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Skapa tagg</DialogTitle>
          <DialogDescription>
            <ValidatedForm
              id="create-tag"
              method="post"
              action={`/api/category-tags/modal-create`}
              validator={validator}
            >
              <FormStack>
                <Input name="name" label="Namn" />
              </FormStack>
              <Button type="submit" form="create-tag">
                Skapa
              </Button>
            </ValidatedForm>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
