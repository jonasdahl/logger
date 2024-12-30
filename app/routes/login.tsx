import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import { authenticator } from "~/.server/auth.server";
import { H1 } from "~/components/headings";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { FormControl } from "~/components/ui/form-control";
import { FormErrorMessage } from "~/components/ui/form-error-message";
import { FormLabel } from "~/components/ui/form-label";
import { FormStack } from "~/components/ui/form-stack";
import { InlineLink } from "~/components/ui/inline-link";
import { Input } from "~/components/ui/input";
import { commitSession, getSessionFromRequest } from "~/session.server";

export async function loader({ request }: LoaderFunctionArgs) {
  await authenticator.isAuthenticated(request, {
    successRedirect: "/",
  });

  const session = await getSessionFromRequest(request);
  const error = session.get(authenticator.sessionErrorKey as "user");
  return json(
    { error },
    { headers: { "Set-Cookie": await commitSession(session) } }
  );
}

export async function action({ request }: ActionFunctionArgs) {
  return await authenticator.authenticate("user-pass", request, {
    successRedirect: "/",
    failureRedirect: "/login",
  });
}

export default function Login() {
  const { error } = useLoaderData<typeof loader>();

  return (
    <div className="bg-slate-100 h-full flex items-center justify-center">
      <Card className="w-[22rem]">
        <CardHeader>
          <CardTitle>
            <H1>Logga in</H1>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form method="post">
            <FormStack>
              <FormControl>
                <FormLabel htmlFor="email">E-postadress</FormLabel>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="jag@exempel.com"
                  required
                />
                {error ? (
                  <FormErrorMessage>
                    Kontrollera e-postadressen.
                  </FormErrorMessage>
                ) : null}
              </FormControl>
              <FormControl>
                <FormLabel htmlFor="password">Lösenord</FormLabel>
                <Input
                  id="password"
                  type="password"
                  name="password"
                  required
                  autoComplete="current-password"
                />
                {error ? (
                  <FormErrorMessage>Kontrollera lösenordet.</FormErrorMessage>
                ) : null}
              </FormControl>
              <Button type="submit" className="w-full">
                Logga in
              </Button>
            </FormStack>
            <div className="mt-4 text-center text-sm">
              Har du inget konto?{" "}
              <InlineLink to="/register">Registrera dig här</InlineLink>
            </div>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
