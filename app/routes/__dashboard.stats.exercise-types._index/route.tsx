import {
  Box,
  Link as ChakraLink,
  Container,
  Heading,
  Stack,
} from "@chakra-ui/react";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { authenticator } from "~/.server/auth.server";
import { StatsExercisesDocument } from "~/graphql/generated/documents";
import { gql } from "~/graphql/graphql.server";
import { getTimeZoneFromRequest } from "~/time";

export async function loader({ request, params }: LoaderFunctionArgs) {
  await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  });

  const timeZone = getTimeZoneFromRequest(request);

  const res = await gql({
    document: StatsExercisesDocument,
    request,
    variables: {},
  });

  return json(res.data);
}

export default function DashboardIndex() {
  const data = useLoaderData<typeof loader>();

  return (
    <Container py={5} maxW="container.md">
      <Stack spacing={5}>
        <Heading>Statistik</Heading>
        <Stack>
          {data?.exerciseTypes?.edges?.map((type) => (
            <Box key={type.cursor}>
              <ChakraLink
                as={Link}
                to={`/stats/exercise-types/${type.node?.id}`}
              >
                {type.node?.name}
              </ChakraLink>
            </Box>
          ))}
        </Stack>
      </Stack>
    </Container>
  );
}
