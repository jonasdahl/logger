import {
  Badge,
  Box,
  HStack,
  IconButton,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Progress,
  Spacer,
  Tooltip,
} from "@chakra-ui/react";
import {
  faCode,
  faLink,
  faRightFromBracket,
  faUser,
  faUserCog,
  faUserLock,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, Outlet, useLoaderData, useNavigation } from "@remix-run/react";
import { authenticator, isAdmin } from "~/.server/auth.server";
import { Link } from "~/components/link";
import { DashboardDocument } from "~/graphql/generated/documents";
import { gql } from "~/graphql/graphql.server";

export async function loader({ request }: LoaderFunctionArgs) {
  const { id: userId } = await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  });
  const { data } = await gql({
    document: DashboardDocument,
    request,
    variables: {},
  });

  return json({
    isAdmin: !!(await isAdmin(userId)),
    email: data?.me?.email,
    currentActivity: data?.currentActivity,
  });
}

export default function Dashboard() {
  const { isAdmin, email, currentActivity } = useLoaderData<typeof loader>();
  const { state } = useNavigation();
  return (
    <Box>
      <Box bg="blue.700" boxShadow="lg" fontWeight="bold">
        <HStack h="100%" py={3} pr={3} pl={5} spacing={5}>
          <Link to="/" color="white">
            Start
          </Link>

          {currentActivity?.__typename === "Exercise" ? (
            <Link
              to={`/exercises/${currentActivity.id}`}
              color="white"
              position="relative"
            >
              Dagens pass
              <Badge
                colorScheme="red"
                position="absolute"
                size="sm"
                variant="solid"
                fontSize="xs"
              >
                1
              </Badge>
            </Link>
          ) : null}

          <Spacer />
          <Menu>
            <Tooltip label={email}>
              <MenuButton
                as={IconButton}
                aria-label="Personlig meny"
                colorScheme="blue"
              >
                <FontAwesomeIcon icon={faUser} />
              </MenuButton>
            </Tooltip>
            <MenuList>
              <MenuItem
                as={Link}
                to="/user"
                icon={<FontAwesomeIcon icon={faUserCog} />}
              >
                Personliga inställningar
              </MenuItem>
              <MenuItem
                as={Link}
                to="/connections"
                icon={<FontAwesomeIcon icon={faLink} />}
              >
                Anslutningar
              </MenuItem>
              {isAdmin ? (
                <>
                  <MenuDivider />

                  <MenuItem
                    as={Link}
                    to="/settings"
                    icon={<FontAwesomeIcon icon={faUserLock} />}
                  >
                    Administration
                  </MenuItem>

                  <MenuItem
                    as={Link}
                    target="_blank"
                    to="/graphiql"
                    icon={<FontAwesomeIcon icon={faCode} />}
                  >
                    GraphiQL
                  </MenuItem>
                </>
              ) : null}
              <MenuDivider />
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
