import {
  Box,
  Container,
  GridItem,
  LinkBox,
  LinkOverlay,
  SimpleGrid,
  VStack,
} from "@chakra-ui/react";
import {
  faBook,
  faCode,
  faExclamationTriangle,
  faLink,
  faRunning,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import type { ReactNode } from "react";
import { assertIsAdmin, authenticator } from "~/.server/auth.server";
import { Link } from "~/components/link";

export async function loader({ request }: LoaderFunctionArgs) {
  const sessionUser = await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  });
  await assertIsAdmin(sessionUser.id);
  return json({});
}

export default function SettingsIndex() {
  return (
    <Container maxW="container.lg" py={5}>
      <SimpleGrid minChildWidth={200} gap={5}>
        <Item
          to="/settings/purposes"
          icon={<FontAwesomeIcon icon={faRunning} />}
        >
          Träningssyften
        </Item>
        <Item to="/settings/users" icon={<FontAwesomeIcon icon={faUsers} />}>
          Användare
        </Item>
        <Item to="/settings/polar" icon={<FontAwesomeIcon icon={faLink} />}>
          Polar
        </Item>
        <Item to="/debug" icon={<FontAwesomeIcon icon={faCode} />}>
          Debug
        </Item>
        <Item
          to="/settings/notifications"
          icon={<FontAwesomeIcon icon={faExclamationTriangle} />}
        >
          Aviseringar
        </Item>
        <Item to="/settings/laws" icon={<FontAwesomeIcon icon={faBook} />}>
          Regelfrågor
        </Item>
      </SimpleGrid>
    </Container>
  );
}

function Item({
  to,
  children,
  icon,
}: {
  to: string;
  children: ReactNode;
  icon: ReactNode;
}) {
  return (
    <GridItem as={LinkBox} padding={5} bg="blue.50" borderRadius="md">
      <VStack>
        <Box fontSize="xl">{icon}</Box>
        <LinkOverlay as={Link} to={to}>
          {children}
        </LinkOverlay>
      </VStack>
    </GridItem>
  );
}
