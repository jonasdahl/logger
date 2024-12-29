import {
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { assertIsAdmin, authenticator } from "~/.server/auth.server";
import { H1 } from "~/components/headings";
import { Container } from "~/components/ui/container";
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

      <TableContainer>
        <Table size="sm">
          <Thead>
            <Tr>
              <Th>E-postadress</Th>
              <Th>Maxpuls</Th>
              <Th>Skapad</Th>
              <Th>Onboardad</Th>
              <Th>Senaste Fogis-synk</Th>
              <Th>Fogis-användare</Th>
              <Th>Polar user ID</Th>
            </Tr>
          </Thead>
          <Tbody>
            {users.map((user) => (
              <Tr key={user.id}>
                <Td>{user.email}</Td>
                <Td>{user.maxPulse}</Td>
                <Td>{user.createdAt}</Td>
                <Td>{user.onboardedAt}</Td>
                <Td>{user.lastFogisSync}</Td>
                <Td>{user.fogisUsername}</Td>
                <Td>{user.polarUserId}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </Container>
  );
}
