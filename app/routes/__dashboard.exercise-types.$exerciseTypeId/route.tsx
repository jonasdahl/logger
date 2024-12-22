import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { withZod } from "@remix-validated-form/with-zod";
import { ValidatedForm } from "remix-validated-form";
import { z } from "zod";
import { authenticator } from "~/.server/auth.server";
import { Input } from "~/components/form/input";
import { SubmitButton } from "~/components/form/submit-button";
import { validate } from "~/components/form/validate.server";
import { H1 } from "~/components/headings";
import { db } from "~/db.server";
import { HiddenReturnToInput } from "~/services/return-to";
import { addSearchParamToPath } from "~/utils/add-search-param-to-path";

import { json, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { GetExcerciseTypeDocument } from "~/graphql/generated/documents";
import { gql } from "~/graphql/graphql.server";

const validator = withZod(
  z.object({
    name: z.string(),
    returnTo: z.string().optional(),
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
    data: { name: data.name },
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
  return json(
    await gql({
      document: GetExcerciseTypeDocument,
      request,
      variables: { exerciseTypeId },
    })
  );
}

export default function Activity() {
  const { data } = useLoaderData<typeof loader>();
  return (
    <div className="container mx-auto px-3 max-w-screen-md py-5 flex flex-col gap-3">
      <H1>Ändra övningstyp</H1>
      <ValidatedForm
        method="post"
        validator={validator}
        defaultValues={{ name: data?.exerciseType?.name }}
      >
        <HiddenReturnToInput />
        <div className="flex flex-col gap-5">
          <div>
            <Input name="name" label="Namn" />
          </div>
          <div>
            <SubmitButton>Spara</SubmitButton>
          </div>
        </div>
      </ValidatedForm>
    </div>
  );
}
