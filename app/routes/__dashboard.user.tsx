import { Button, Container, Heading, Stack } from "@chakra-ui/react";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import { withZod } from "@remix-validated-form/with-zod";
import { useEffect, useState } from "react";
import { ValidatedForm } from "remix-validated-form";
import { z } from "zod";
import { authenticator } from "~/.server/auth.server";
import { SubmitButton } from "~/components/form/submit-button";
import { validate } from "~/components/form/validate.server";
import { ValidatedInputField } from "~/components/form/validated-input-field";
import { db } from "~/db.server";
import { notify } from "~/push/notifications.server";
import { vapidKeys } from "~/secrets.server";

const validator = withZod(
  z.union([
    z.object({ _action: z.literal("testNotifications") }),
    z.object({
      _action: z.literal("saveSettings"),
      maxPulse: z.union([
        z
          .literal("")
          .nullable()
          .optional()
          .transform(() => null),
        z.coerce
          .number()
          .max(300, "Orimlig maxpuls.")
          .min(40, "Orimlig maxpuls."),
      ]),
    }),
  ])
);

export async function action({ request }: LoaderFunctionArgs) {
  const sessionUser = await authenticator.isAuthenticated(request, {
    failureRedirect: "/",
  });
  const form = await validate({ request, validator });
  if (form._action === "testNotifications") {
    const pushes = await db.pushSubscription.findMany({
      where: { userId: sessionUser.id },
    });
    for (const push of pushes) {
      await notify(push, "This is a test.").catch((e) => console.log(e));
    }
    return redirect("/user");
  }
  const { maxPulse } = form;
  await db.user.update({
    where: { id: sessionUser.id },
    data: { maxPulse },
  });
  const url = new URL(request.url);
  const redirectTo = url.searchParams.get("returnTo") ?? "/user";
  return redirect(redirectTo);
}

export async function loader({ request }: LoaderFunctionArgs) {
  const sessionUser = await authenticator.isAuthenticated(request, {
    failureRedirect: "/",
  });
  const user = await db.user.findUniqueOrThrow({
    where: { id: sessionUser.id },
  });
  return json({ user, publicKey: vapidKeys.publicKey });
}

export default function User() {
  const { user, publicKey } = useLoaderData<typeof loader>();

  const [subscription, setSubscription] = useState<
    null | undefined | PushSubscription
  >(undefined);

  useEffect(() => {
    async function checkNotificationPermission() {
      const registration = await navigator.serviceWorker.getRegistration(
        "/sw.js"
      );
      if (!registration) {
        setSubscription(null);
        return;
      }

      const subscription = await registration.pushManager.getSubscription();
      setSubscription(subscription);
    }
    checkNotificationPermission();
    return () => {};
  }, [publicKey]);

  return (
    <Container py={5}>
      <Stack spacing={5}>
        <ValidatedForm validator={validator} method="post">
          <input type="hidden" name="_action" value="saveSettings" />
          <Stack spacing={5}>
            <Heading as="h1">Personliga inställningar</Heading>
            <ValidatedInputField
              label="Maxpuls"
              name="maxPulse"
              type="number"
              defaultValue={user.maxPulse?.toFixed(0) ?? undefined}
            />
            <div>
              <SubmitButton>Spara</SubmitButton>
            </div>
          </Stack>
        </ValidatedForm>

        <Heading as="h2">Aviseringsinställningar</Heading>
        <div>
          {subscription === undefined ? (
            <Button isLoading isDisabled />
          ) : subscription === null ? (
            <Button
              onClick={async () => {
                const result = await Notification.requestPermission().catch(
                  () => null
                );
                if (result !== "granted") {
                  console.warn("Not granted");
                  return;
                }

                const registration =
                  await navigator.serviceWorker.getRegistration("/sw.js");
                if (!registration) {
                  throw new Error("No registration");
                }

                const sub = await registration.pushManager.subscribe({
                  applicationServerKey: publicKey,
                  userVisibleOnly: true,
                });
                setSubscription(sub);
                const data = JSON.parse(JSON.stringify(sub)) as any;
                await fetch("/api/push/subscribe", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    endpoint: sub.endpoint,
                    keys: data.keys,
                  }),
                });
              }}
            >
              Aktivera aviseringar för denna enhet
            </Button>
          ) : (
            <Stack>
              <div>
                <Form method="post">
                  <input
                    type="hidden"
                    name="_action"
                    value="testNotifications"
                  />
                  <Button type="submit">Testa aviseringar</Button>
                </Form>
              </div>
              <div>
                <Button
                  colorScheme="red"
                  onClick={async () => {
                    const registration =
                      await navigator.serviceWorker.getRegistration("/sw.js");
                    if (!registration) {
                      throw new Error("No registration");
                    }
                    registration.pushManager
                      .getSubscription()
                      .then((sub) => sub?.unsubscribe());
                    setSubscription(null);
                  }}
                >
                  Stäng av aviseringar för denna enhet
                </Button>
              </div>
            </Stack>
          )}
        </div>
      </Stack>
    </Container>
  );
}
