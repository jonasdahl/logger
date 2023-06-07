import {
  Box,
  HStack,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Spacer,
} from "@chakra-ui/react";
import {
  faLink,
  faRightFromBracket,
  faUser,
  faUserCog,
  faUserLock,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, Outlet, useLoaderData } from "@remix-run/react";
import { authenticator, isAdmin } from "~/auth.server";
import { Link } from "~/components/link";

export async function loader({ request }: LoaderArgs) {
  const { id: userId } = await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  });
  return json({ isAdmin: await isAdmin(userId) });
}

export default function Dashboard() {
  const { isAdmin } = useLoaderData<typeof loader>();

  return (
    <Box>
      <Box bg="blue.700" boxShadow="lg" fontWeight="bold" overflowX="auto">
        <HStack h="100%" py={3} pr={3} pl={5} spacing={5}>
          <Link to="/" color="white">
            Start
          </Link>
          <Link to="/calendar" color="white">
            Kalender
          </Link>
          <Spacer />
          <Menu>
            <MenuButton
              as={IconButton}
              aria-label="Personlig meny"
              colorScheme="blue"
            >
              <FontAwesomeIcon icon={faUser} />
            </MenuButton>
            <MenuList>
              <MenuItem
                as={Link}
                to="/user"
                icon={<FontAwesomeIcon icon={faUserCog} />}
              >
                Personliga inställningar
              </MenuItem>
              {isAdmin ? (
                <MenuItem
                  as={Link}
                  to="/settings"
                  icon={<FontAwesomeIcon icon={faUserLock} />}
                >
                  Inställningar
                </MenuItem>
              ) : null}
              <MenuItem
                as={Link}
                to="/connections"
                icon={<FontAwesomeIcon icon={faLink} />}
              >
                Anslutningar
              </MenuItem>

              <Form method="post" action="/logout">
                <MenuItem
                  type="submit"
                  color="red.500"
                  icon={<FontAwesomeIcon icon={faRightFromBracket} />}
                >
                  Logga ut
                </MenuItem>
              </Form>
            </MenuList>
          </Menu>
        </HStack>
      </Box>
      <Outlet />
    </Box>
  );
}
