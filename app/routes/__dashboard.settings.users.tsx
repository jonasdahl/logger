import {
  Container,
  Heading,
  Stack,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { assertIsAdmin, authenticator } from "~/auth.server";
import { db } from "~/db.server";

export async function loader({ request }: LoaderArgs) {
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
    <Container py={5} maxW="container.xl">
      <Stack spacing={5}>
        <Heading>Användare</Heading>
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
      </Stack>
    </Container>
  );
}
