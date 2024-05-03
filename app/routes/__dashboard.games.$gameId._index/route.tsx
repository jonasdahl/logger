import {
  Container,
  Heading,
  Spacer,
  Stack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Wrap,
  WrapItem,
} from "@chakra-ui/react";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { authenticator } from "~/.server/auth.server";
import { HiddenReturnToInput } from "~/services/return-to";

import { useLoaderData } from "@remix-run/react";
import { DateTime } from "luxon";
import { z } from "zod";
import { ButtonLink } from "~/components/button-link";
import { GameDocument } from "~/graphql/generated/documents";
import { gql } from "~/graphql/graphql.server";

export async function loader({ request, params }: LoaderFunctionArgs) {
  await authenticator.isAuthenticated(request, { failureRedirect: "/" });
  const { gameId } = z.object({ gameId: z.string() }).parse(params);

  const res = await gql({
    document: GameDocument,
    request,
    variables: { gameId },
  });

  return json(res.data);
}

export default function Game() {
  const data = useLoaderData<typeof loader>();
  const start = data?.game?.start;

  return (
    <Container py={5} maxW="container.md">
      <HiddenReturnToInput />
      <Stack spacing={5}>
        <Wrap align="center">
          <WrapItem>
            <Heading as="h1">Match</Heading>
          </WrapItem>
          <Spacer />
          {start ? (
            <WrapItem>
              <ButtonLink
                variant="link"
                to={`/days/${DateTime.fromISO(start).toFormat("yyyy-MM-dd")}`}
              >
                Visa dag
              </ButtonLink>
            </WrapItem>
          ) : null}
        </Wrap>

        <Tabs>
          <TabList>
            <Tab>Packlista</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>TBD</TabPanel>
          </TabPanels>
        </Tabs>
      </Stack>
    </Container>
  );
}
