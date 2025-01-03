import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { withZod } from "@remix-validated-form/with-zod";
import { ValidatedForm } from "remix-validated-form";
import { z } from "zod";
import { authenticator } from "~/.server/auth.server";
import { SubmitButton } from "~/components/form/submit-button";
import { validate } from "~/components/form/validate.server";
import { ValidatedInputField } from "~/components/form/validated-input-field";
import { H1 } from "~/components/headings";
import { db } from "~/db.server";
import { HiddenReturnToInput } from "~/services/return-to";
import { addSearchParamToPath } from "~/utils/add-search-param-to-path";

import { redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { useMemo } from "react";
import { zfd } from "zod-form-data";
import { ValidatedComboboxField } from "~/components/form/validated-combobox-field";
import { FormStack } from "~/components/ui/form-stack";
import { GetExcerciseTypeDocument } from "~/graphql/generated/documents";
import { gql } from "~/graphql/graphql.server";
import { CreateTagModal } from "../api.category-tags.modal-create._index/route";

const validator = withZod(
  z.object({
    name: z.string(),
    returnTo: z.string().optional(),
    tags: zfd.repeatableOfType(z.string()).optional(),
  })
);

export async function action({ request, params }: ActionFunctionArgs) {
  const { id: userId } = await authenticator.isAuthenticated(request, {
    failureRedirect: "/",
  });

  const data = await validate({ request, validator });

  const exerciseType = await db.exerciseType.findFirstOrThrow({
    where: { id: params.exerciseTypeId!, userId },
  });

  await db.exerciseType.update({
    where: { id: exerciseType.id },
    data: {
      name: data.name,
      categoryTags: { set: (data.tags || []).map((id) => ({ id })) },
    },
  });

  return redirect(
    addSearchParamToPath(
      data.returnTo ?? "/exercise-types",
      "createdExerciseTypeId",
      exerciseType.id
    )
  );
}

export async function loader({ request, params }: LoaderFunctionArgs) {
  const { exerciseTypeId } = z
    .object({ exerciseTypeId: z.string() })
    .parse(params);
  return gql({
    document: GetExcerciseTypeDocument,
    request,
    variables: { exerciseTypeId },
  });
}

export default function Activity() {
  const { data } = useLoaderData<typeof loader>();

  const tagOptions = useMemo(
    () =>
      data?.categoryTags.map(({ id, name }) => ({ value: id, label: name })) ||
      [],
    [data?.categoryTags]
  );

  return (
    <div className="container mx-auto px-3 max-w-screen-md py-5 flex flex-col gap-3">
      <H1>Ändra övningstyp</H1>
      <ValidatedForm
        method="post"
        validator={validator}
        defaultValues={{
          name: data?.exerciseType?.name,
          tags: data?.exerciseType?.categoryTags.map((t) => t.id),
        }}
      >
        <HiddenReturnToInput />
        <div className="flex flex-col gap-5">
          <FormStack>
            <ValidatedInputField name="name" label="Namn" />
            <ValidatedComboboxField
              name="tags"
              label="Taggar"
              options={tagOptions}
            />
          </FormStack>
          <div>
            <SubmitButton>Spara</SubmitButton>
          </div>
        </div>
      </ValidatedForm>

      <div>
        <CreateTagModal
          trigger={
            <button className="text-sm font-bold" type="button">
              Skapa tagg
            </button>
          }
        />
      </div>
    </div>
  );
}
