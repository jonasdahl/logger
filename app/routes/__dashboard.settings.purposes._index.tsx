import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { assertIsAdmin, authenticator } from "~/.server/auth.server";
import { ButtonLink } from "~/components/button-link";
import { H1 } from "~/components/headings";
import { Container } from "~/components/ui/container";
import { InlineLink } from "~/components/ui/inline-link";
import { Table, TableBody, TableCell, TableRow } from "~/components/ui/table";
import { TitleRow } from "~/components/ui/title-row";
import { db } from "~/db.server";

export async function loader({ request }: LoaderFunctionArgs) {
  const sessionUser = await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  });
  await assertIsAdmin(sessionUser.id);

  const purposes = await db.activityPurpose.findMany({
    orderBy: { label: "asc" },
  });

  return json({ purposes });
}

export default function SettingsIndex() {
  const { purposes } = useLoaderData<typeof loader>();

  return (
    <Container className="flex flex-col gap-5">
      <TitleRow
        actions={
          <ButtonLink to="/settings/purposes/create" variant="outline">
            Skapa
          </ButtonLink>
        }
      >
        <H1>Träningssyften</H1>
      </TitleRow>

      <Table>
        <TableBody>
          {purposes.map((purpose) => (
            <TableRow key={purpose.id}>
              <TableCell>
                <InlineLink to={`/settings/purposes/${purpose.id}`}>
                  {purpose.label}
                </InlineLink>
              </TableCell>
              <TableCell>
                <InlineLink to={`/settings/purposes/${purpose.id}`}>
                  {purpose.shortLabel}
                </InlineLink>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Container>
  );
}
