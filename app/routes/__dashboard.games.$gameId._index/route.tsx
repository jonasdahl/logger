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
import { DateTime, Duration } from "luxon";
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
            <Tab>Resa</Tab>
          </TabList>
          <TabPanels>
            {isStarted ? (
              <TabPanel px={0}>
                <Overview data={data} />
              </TabPanel>
            ) : null}
            {isStarted ? (
              <TabPanel px={0}>
                <TimeLine data={data} />
              </TabPanel>
            ) : null}
            <TabPanel px={0}>TBD</TabPanel>
            <TabPanel px={0}>TBD</TabPanel>
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
            <Td textAlign="right">
              {Duration.fromMillis((totalTime?.zone5 ?? 0) * 1000)
                .shiftTo("minutes", "seconds")
                .toFormat("m'min' ss's'")}
            </Td>
          </Tr>
          <Tr>
            <Td>Tid i zon 4:</Td>
            <Td textAlign="right">
              {Duration.fromMillis((totalTime?.zone4 ?? 0) * 1000)
                .shiftTo("minutes", "seconds")
                .toFormat("m'min' ss's'")}
            </Td>
          </Tr>
          <Tr>
            <Td>Tid i zon 3:</Td>
            <Td textAlign="right">
              {Duration.fromMillis((totalTime?.zone3 ?? 0) * 1000)
                .shiftTo("minutes", "seconds")
                .toFormat("m'min' ss's'")}
            </Td>
          </Tr>
          <Tr>
            <Td>Tid i zon 2:</Td>
            <Td textAlign="right">
              {Duration.fromMillis((totalTime?.zone2 ?? 0) * 1000)
                .shiftTo("minutes", "seconds")
                .toFormat("m'min' ss's'")}
            </Td>
          </Tr>
          <Tr>
            <Td>Tid i zon 1:</Td>
            <Td textAlign="right">
              {Duration.fromMillis((totalTime?.zone1 ?? 0) * 1000)
                .shiftTo("minutes", "seconds")
                .toFormat("m'min' ss's'")}
            </Td>
          </Tr>
        </Tbody>
      </Table>
    </Box>
  );
}

function TimeLine({ data }: { data: SerializeFrom<typeof loader> }) {
  return (
    <Box position="relative">
      {data?.game?.startDay.events.map((event) => {
        return (
          <Box position="absolute" key={event.time}>
            {DateTime.fromISO(event.time).toFormat("HH:mm")}:{" "}
            {event.description}
          </Box>
        );
      })}
    </Box>
  );
}
