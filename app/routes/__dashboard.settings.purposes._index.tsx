import {
  Container,
  HStack,
  Heading,
  Spacer,
  Stack,
  Table,
  TableContainer,
  Tbody,
  Td,
  Tr,
} from "@chakra-ui/react";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { assertIsAdmin, authenticator } from "~/auth.server";
import { ButtonLink } from "~/components/button-link";
import { Link } from "~/components/link";
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
    <Container maxW="container.lg" py={5}>
      <Stack spacing={5}>
        <HStack>
          <Heading>Träningssyften</Heading>
          <Spacer />
          <ButtonLink to="/settings/purposes/create">Skapa</ButtonLink>
        </HStack>
        <TableContainer>
          <Table size="sm">
            <Tbody>
              {purposes.map((purpose) => (
                <Tr key={purpose.id}>
                  <Td>
                    <Link to={`/settings/purposes/${purpose.id}`}>
                      {purpose.label}
                    </Link>
                  </Td>
                  <Td>
                    <Link to={`/settings/purposes/${purpose.id}`}>
                      {purpose.shortLabel}
                    </Link>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
      </Stack>
    </Container>
  );
}
