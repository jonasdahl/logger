import {
  Box,
  Button,
  HStack,
  LinkBox,
  LinkOverlay,
  Spacer,
  Stack,
  VStack,
  Wrap,
  useBreakpointValue,
} from "@chakra-ui/react";
import {
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { LoaderFunctionArgs } from "@remix-run/node";
import {
  Form,
  Link as RemixLink,
  useLoaderData,
  useLocation,
} from "@remix-run/react";
import { DateTime } from "luxon";
import { authenticator } from "~/.server/auth.server";
import { ButtonLink } from "~/components/button-link";
import { H1, H2 } from "~/components/headings";
import { IconButtonLink } from "~/components/icon-button-link";
import { Container } from "~/components/ui/container";
import { InlineLink } from "~/components/ui/inline-link";
import { db } from "~/db.server";
import { ShowDayDocument } from "~/graphql/generated/documents";
import { gql } from "~/graphql/graphql.server";
import { getTimeZoneFromRequest } from "~/time";

export async function loader({ request, params }: LoaderFunctionArgs) {
  const { id } = await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  });
  const timeZone = getTimeZoneFromRequest(request);
  if (!params.day) {
    throw new Error("No day param");
  }
  const day = DateTime.fromFormat(params.day, "yyyy-MM-dd", {
    zone: timeZone,
  }).setZone(timeZone);
  const dayStart = day.startOf("day");
  const dayEnd = day.endOf("day");

  const timeFilter = { gte: dayStart.toJSDate(), lte: dayEnd.toJSDate() };

  const user = await db.user.findFirstOrThrow({
    where: { id },
    include: {
      polarExercises: {
        where: { startTime: timeFilter },
        orderBy: { startTime: "asc" },
      },
    },
  });

  const res = await gql({
    document: ShowDayDocument,
    request,
    variables: { date: params.day },
  });

  return {
    dayStart: dayStart.toISO(),
    dayEnd: dayEnd.toISO(),
    timeZone,
    polarEntries: user.polarExercises,
    data: res.data,
  };
}

export default function DashboardIndex() {
  const { dayStart, polarEntries, timeZone, data } =
    useLoaderData<typeof loader>();

  const { pathname } = useLocation();

  const day = DateTime.fromISO(dayStart!).setZone(timeZone);
  const dayBefore = day.minus({ days: 1 });
  const dayAfter = day.plus({ days: 1 });

  const isSmallScreen = useBreakpointValue([true, true, false]);

  return (
    <Container>
      <Stack spacing={5}>
        <HStack>
          <ButtonLink
            to={`/days/${DateTime.now()
              .setZone(timeZone)
              .toFormat("yyyy-MM-dd")}`}
          >
            Idag
          </ButtonLink>
          <Spacer />
          {day.diffNow().toMillis() < 0 ? (
            <ButtonLink
              to={`/activities/create?date=${day.toFormat(
                "yyyy-MM-dd"
              )}&returnTo=${pathname}`}
            >
              Registrera
            </ButtonLink>
          ) : null}
          {day.endOf("day").diffNow().toMillis() < 0 ? null : (
            <ButtonLink
              to={`/planned-activities/create?date=${day.toFormat(
                "yyyy-MM-dd"
              )}&returnTo=${pathname}`}
            >
              Planera
            </ButtonLink>
          )}
        </HStack>

        <HStack>
          {isSmallScreen ? (
            <IconButtonLink
              to={`/days/${dayBefore.toFormat("yyyy-MM-dd")}`}
              aria-label="Föregående dag"
            >
              <FontAwesomeIcon icon={faChevronLeft} />
            </IconButtonLink>
          ) : (
            <ButtonLink to={`/days/${dayBefore.toFormat("yyyy-MM-dd")}`}>
              <FontAwesomeIcon icon={faChevronLeft} />{" "}
              {dayBefore.toFormat("yyyy-MM-dd")}
            </ButtonLink>
          )}

          <Spacer />
          <VStack textAlign="center" spacing={0}>
            <H1>{day.toFormat("yyyy-MM-dd")}</H1>
            <Box fontSize="xs" display={{ base: "none", sm: "block" }}>
              {day.toFormat("EEEE 'vecka' WW, kkkk", { locale: "sv" })}
            </Box>
          </VStack>
          <Spacer />

          {isSmallScreen ? (
            <IconButtonLink
              to={`/days/${dayAfter.toFormat("yyyy-MM-dd")}`}
              aria-label="Nästa dag"
            >
              <FontAwesomeIcon icon={faChevronRight} />
            </IconButtonLink>
          ) : (
            <ButtonLink to={`/days/${dayAfter.toFormat("yyyy-MM-dd")}`}>
              {dayAfter.toFormat("yyyy-MM-dd")}
              <FontAwesomeIcon icon={faChevronRight} />
            </ButtonLink>
          )}
        </HStack>

        {polarEntries.length ? (
          <Stack>
            <H2>Data från Polar</H2>
            <Stack>
              {polarEntries.map((e) => (
                <Box key={e.id} bg="blue.50" borderRadius="md" padding={3}>
                  <InlineLink to={`/connections/polar/exercise/${e.id}`}>
                    {DateTime.fromISO(e.startTime)
                      .setZone(timeZone)
                      .toFormat("HH:mm")}
                  </InlineLink>
                </Box>
              ))}
            </Stack>
          </Stack>
        ) : null}

        <Stack>
          <H2>Alla aktiviteter</H2>
          <Stack>
            {data?.day?.activities.edges.map((e) => {
              if (!e.node) {
                return null;
              }

              if (e.node?.__typename === "PhysicalTest") {
                return (
                  <Box
                    key={e.node.id}
                    bg="yellow.50"
                    borderRadius="md"
                    padding={3}
                  >
                    {DateTime.fromISO(e.node.start)
                      .setZone(timeZone)
                      .toFormat("HH:mm")}{" "}
                    {e.node.title}
                  </Box>
                );
              }

              if (
                e.node?.__typename === "CustomGame" ||
                e.node?.__typename === "FogisGame"
              ) {
                return (
                  <LinkBox
                    key={e.node.id}
                    bg="red.50"
                    borderRadius="md"
                    padding={3}
                    fontWeight="bold"
                    _hover={{ textDecoration: "underline" }}
                  >
                    {DateTime.fromISO(e.node.start)
                      .setZone(timeZone)
                      .toFormat("HH:mm")}{" "}
                    <LinkOverlay as={RemixLink} to={`/games/${e.node.id}`}>
                      {e.node.title}
                    </LinkOverlay>
                  </LinkBox>
                );
              }

              if (e.node.__typename === "PlannedExercise") {
                return (
                  <Box
                    key={e.node.id}
                    bg="blue.50"
                    borderRadius="md"
                    padding={3}
                  >
                    <HStack>
                      <Wrap spacing={3}>
                        <Box as="time">
                          {DateTime.fromISO(e.node.start)
                            .setZone(timeZone)
                            .toFormat("HH:mm")}{" "}
                          Planerat:
                        </Box>

                        {e.node.primaryPurpose ? (
                          <div>Primärt: {e.node.primaryPurpose.label}</div>
                        ) : null}
                        {e.node.secondaryPurpose ? (
                          <div>Sekundärt: {e.node.secondaryPurpose.label}</div>
                        ) : null}
                        {e.node.description ? (
                          <div>{e.node.description}</div>
                        ) : null}
                        {e.node.comment ? <div>{e.node.comment}</div> : null}
                      </Wrap>
                      <Spacer />
                      <div>
                        <ButtonLink
                          size="sm"
                          to={`/activities/create?from=${e.node.id}`}
                        >
                          Registrera
                        </ButtonLink>
                      </div>
                      <div>
                        <ButtonLink
                          size="sm"
                          variant="destructive"
                          to={`/planned-activities/${e.node.id}/delete`}
                        >
                          Radera
                        </ButtonLink>
                      </div>
                    </HStack>
                  </Box>
                );
              }

              if (e.node.__typename === "Exercise") {
                return (
                  <Box
                    key={e.node.id}
                    bg="blue.50"
                    borderRadius="md"
                    padding={3}
                  >
                    <HStack>
                      <LinkBox>
                        <Wrap spacing={3}>
                          <LinkOverlay
                            as={InlineLink}
                            to={`/exercises/${e.node.id}`}
                          >
                            {DateTime.fromISO(e.node.start)
                              .setZone(timeZone)
                              .toFormat("HH:mm")}
                          </LinkOverlay>
                          {e.node.primaryPurpose ? (
                            <div>Primärt: {e.node.primaryPurpose.label}</div>
                          ) : null}
                          {e.node.secondaryPurpose ? (
                            <div>
                              Sekundärt: {e.node.secondaryPurpose.label}
                            </div>
                          ) : null}
                          {e.node.description ? (
                            <div>{e.node.description}</div>
                          ) : null}
                          {e.node.comment ? <div>{e.node.comment}</div> : null}
                        </Wrap>
                      </LinkBox>
                      <Spacer />
                      <div>
                        <ButtonLink
                          size="sm"
                          variant="destructive"
                          to={`/activities/${e.node.id}/delete`}
                        >
                          Radera
                        </ButtonLink>
                      </div>
                      <div>
                        <Form
                          method="post"
                          action={`/activities/${e.node.id}/hide`}
                        >
                          {e.node.isHiddenFromOverview ? (
                            <Button size="sm" colorScheme="green" type="submit">
                              Visa i översikten
                            </Button>
                          ) : (
                            <Button
                              size="sm"
                              colorScheme="yellow"
                              type="submit"
                            >
                              Dölj i översikten
                            </Button>
                          )}
                        </Form>
                      </div>
                    </HStack>
                  </Box>
                );
              }

              return (
                <Box key={e.node.id} bg="gray.50" borderRadius="md" padding={3}>
                  {DateTime.fromISO(e.node.start)
                    .setZone(timeZone)
                    .toFormat("HH:mm")}{" "}
                  {e.node.title}
                </Box>
              );
            })}
          </Stack>
        </Stack>
      </Stack>
    </Container>
  );
}
