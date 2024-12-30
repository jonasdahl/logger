import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { withZod } from "@remix-validated-form/with-zod";
import { ValidatedForm } from "remix-validated-form";
import { z } from "zod";
import { authenticator, signUp } from "~/.server/auth.server";
import { SubmitButton } from "~/components/form/submit-button";
import { validate } from "~/components/form/validate.server";
import { ValidatedInputField } from "~/components/form/validated-input-field";
import { H1 } from "~/components/headings";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { FormStack } from "~/components/ui/form-stack";
import { InlineLink } from "~/components/ui/inline-link";
import { commitSession, getSessionFromRequest } from "~/session.server";

const validator = withZod(
  z
    .object({
      email: z.string().email("E-postadressen är inte giltig"),
      password: z.string().min(8, "Lösenordet måste vara minst 8 tecken långt"),
      confirmPassword: z
        .string()
        .min(8, "Lösenordet måste vara minst 8 tecken långt"),
    })
    .refine(
      (data) => data.password === data.confirmPassword,
      "Båda lösenorden måste stämma överens"
    )
);

export async function loader({ request }: LoaderFunctionArgs) {
  await authenticator.isAuthenticated(request, { successRedirect: "/" });
  const session = await getSessionFromRequest(request);
  const error = session.get(authenticator.sessionErrorKey as "user");
  return json(
    { error },
    { headers: { "Set-Cookie": await commitSession(session) } }
  );
}

export async function action({ request }: ActionFunctionArgs) {
  const data = await validate({ request, validator });
  const session = await getSessionFromRequest(request);
  const user = await signUp(data);
  session.set(authenticator.sessionKey as "user", user);
  return redirect("/", {
    headers: { "Set-Cookie": await commitSession(session) },
  });
}

export default function Register() {
  return (
    <div className="bg-slate-100 h-full flex items-center justify-center">
      <Card className="w-[22rem]">
        <CardHeader>
          <CardTitle>
            <H1>Registrera konto</H1>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ValidatedForm validator={validator} method="post">
            <FormStack>
              <ValidatedInputField
                label="E-postadress"
                name="email"
                type="email"
              />
              <ValidatedInputField
                label="Lösenord"
                name="password"
                type="password"
                autoComplete="new-password"
              />
              <ValidatedInputField
                label="Upprepa lösenord"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
              />
              <SubmitButton>Skapa konto</SubmitButton>
            </FormStack>
            <div className="mt-4 text-center text-sm">
              Har du redan ett konto?{" "}
              <InlineLink to="/login">Logga in</InlineLink>
            </div>
          </ValidatedForm>
        </CardContent>
      </Card>
    </div>
  );
}
