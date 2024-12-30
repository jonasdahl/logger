import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { assertIsAdmin, authenticator } from "~/.server/auth.server";
import { H1 } from "~/components/headings";
import { Container } from "~/components/ui/container";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { db } from "~/db.server";

export async function loader({ request }: LoaderFunctionArgs) {
  const sessionUser = await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  });
  await assertIsAdmin(sessionUser.id);
  const users = await db.user.findMany({});
  return json({ users });
}

export default function Users() {
  const { users } = useLoaderData<typeof loader>();
  return (
    <Container className="flex flex-col gap-5">
      <H1>Användare</H1>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>E-postadress</TableHead>
            <TableHead>Maxpuls</TableHead>
            <TableHead>Skapad</TableHead>
            <TableHead>Onboardad</TableHead>
            <TableHead>Senaste Fogis-synk</TableHead>
            <TableHead>Fogis-användare</TableHead>
            <TableHead>Polar user ID</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.maxPulse}</TableCell>
              <TableCell>{user.createdAt}</TableCell>
              <TableCell>{user.onboardedAt}</TableCell>
              <TableCell>{user.lastFogisSync}</TableCell>
              <TableCell>{user.fogisUsername}</TableCell>
              <TableCell>{user.polarUserId}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Container>
  );
}
