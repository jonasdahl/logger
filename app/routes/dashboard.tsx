import { Box, Button, HStack, Spacer } from "@chakra-ui/react";
import { Form, Outlet } from "@remix-run/react";
import { Link } from "~/components/link";

export default function Dashboard() {
  return (
    <Box>
      <Box bg="blue.700">
        <HStack h="100%" p={4}>
          <Link to="/" color="white">
            Start
          </Link>
          <Link to="/" color="white">
            Anslutningar
          </Link>
          <Spacer />
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
