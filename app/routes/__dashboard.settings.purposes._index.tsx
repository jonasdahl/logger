import {
  Container,
  HStack,
  Heading,
  Spacer,
  Table,
  TableContainer,
  Tbody,
  Td,
  Tr,
} from "@chakra-ui/react";
import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { authenticator } from "~/auth.server";
import { ButtonLink } from "~/components/button-link";
import { db } from "~/db.server";

export async function loader({ request }: LoaderArgs) {
  const sessionUser = await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  });
  const user = await db.user.findUniqueOrThrow({
    where: { id: sessionUser.id },
  });
  if (user.email !== "jonas@jdahl.se") {
    throw new Error("Invalid user");
  }

  const purposes = await db.activityPurpose.findMany({
    orderBy: { label: "asc" },
  });

  return json({ purposes });
}

export default function SettingsIndex() {
  const { purposes } = useLoaderData<typeof loader>();

  return (
    <Container maxW="container.lg" py={5}>
      <HStack>
        <Heading>Träningssyften</Heading>
        <Spacer />
        <ButtonLink to="/settings/purposes/create">Skapa</ButtonLink>
      </HStack>
      <TableContainer>
        <Table>
          <Tbody>
            {purposes.map((purpose) => (
              <Tr key={purpose.id}>
                <Td>{purpose.label}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </Container>
  );
}
