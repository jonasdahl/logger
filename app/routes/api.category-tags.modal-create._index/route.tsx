import type { ActionFunctionArgs } from "@remix-run/node";
import { withZod } from "@remix-validated-form/with-zod";
import { useState, type ReactNode } from "react";
import { ValidatedForm } from "remix-validated-form";
import { z } from "zod";
import { authenticator } from "~/.server/auth.server";
import { SubmitButton } from "~/components/form/submit-button";
import { validate } from "~/components/form/validate.server";
import { ValidatedInputField } from "~/components/form/validated-input-field";
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
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
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
              onSubmit={() => {
                setIsOpen(false);
              }}
            >
              <FormStack>
                <ValidatedInputField name="name" label="Namn" />
                <SubmitButton>Skapa</SubmitButton>
              </FormStack>
            </ValidatedForm>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
