import { Box, Button, HStack, Spacer } from "@chakra-ui/react";
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
      <Box bg="blue.700" boxShadow="lg" fontWeight="bold">
        <HStack h="100%" p={5} spacing={5}>
          <Link to="/" color="white">
            Start
          </Link>
          <Link to="/connections" color="white">
            Anslutningar
          </Link>
          <Spacer />
          {isAdmin ? (
            <Link to="/settings" color="white">
              Inställningar
            </Link>
          ) : null}
          <Form method="post" action="/logout">
            <Button type="submit" color="white" variant="link">
              Logga ut
            </Button>
          </Form>
        </HStack>
      </Box>
      <Outlet />
    </Box>
  );
}
