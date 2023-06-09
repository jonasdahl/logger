import {
  Box,
  HStack,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Progress,
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
import { Form, Outlet, useLoaderData, useNavigation } from "@remix-run/react";
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
  const { state } = useNavigation();
  return (
    <Box>
      <Box bg="blue.700" boxShadow="lg" fontWeight="bold">
        <HStack h="100%" py={3} pr={3} pl={5} spacing={5}>
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
                  Administration
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
      <Box position="relative">
        {state !== "idle" ? (
          <Progress
            colorScheme="yellow"
            bg="transparent"
            isIndeterminate
            position="absolute"
            left={0}
            right={0}
            bottom={0}
            size="xs"
          />
        ) : null}
      </Box>
      <Outlet />
    </Box>
  );
}
