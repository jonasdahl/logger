import {
  Box,
  Container,
  Heading,
  Spacer,
  Stack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Table,
  Tabs,
  Tbody,
  Td,
  Tr,
  Wrap,
  WrapItem,
} from "@chakra-ui/react";
import type { LoaderFunctionArgs, SerializeFrom } from "@remix-run/node";
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
  const now = DateTime.now();
  const isStarted = start ? DateTime.fromISO(start) < now : false;

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
            {isStarted ? <Tab>Översikt</Tab> : null}
            {isStarted ? <Tab>Tidslinje</Tab> : null}
            <Tab>Packlista</Tab>
          </TabList>
          <TabPanels>
            {isStarted ? (
              <TabPanel px={0}>
                <Overview data={data} />
              </TabPanel>
            ) : null}
            {isStarted ? (
              <TabPanel px={0}>
                <TimeLine />
              </TabPanel>
            ) : null}
            <TabPanel>TBD</TabPanel>
          </TabPanels>
        </Tabs>
      </Stack>
    </Container>
  );
}

function Overview({ data }: { data: SerializeFrom<typeof loader> }) {
  const totalTime = data?.game?.startDay.heartRateSummary;
  return (
    <Box>
      <Table size="sm">
        <Tbody>
          <Tr>
            <Td>Tid i zon 5:</Td>
            <Td>{totalTime?.zone5}</Td>
          </Tr>
          <Tr>
            <Td>Tid i zon 4:</Td>
            <Td>{totalTime?.zone4}</Td>
          </Tr>
          <Tr>
            <Td>Tid i zon 3:</Td>
            <Td>{totalTime?.zone3}</Td>
          </Tr>
          <Tr>
            <Td>Tid i zon 2:</Td>
            <Td>{totalTime?.zone2}</Td>
          </Tr>
          <Tr>
            <Td>Tid i zon 1:</Td>
            <Td>{totalTime?.zone1}</Td>
          </Tr>
        </Tbody>
      </Table>
    </Box>
  );
}

function TimeLine() {
  return <Box>TBD</Box>;
}
