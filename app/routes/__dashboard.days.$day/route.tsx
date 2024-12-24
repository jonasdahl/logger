import {
  Box,
  Button,
  Container,
  HStack,
  Heading,
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
import { json } from "@remix-run/node";
import {
  Form,
  Link as RemixLink,
  useLoaderData,
  useLocation,
} from "@remix-run/react";
import { DateTime } from "luxon";
import { authenticator } from "~/.server/auth.server";
import { ButtonLink } from "~/components/button-link";
import { IconButtonLink } from "~/components/icon-button-link";
import { Link } from "~/components/link";
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

  return json({
    dayStart: dayStart.toISO(),
    dayEnd: dayEnd.toISO(),
    timeZone,
    polarEntries: user.polarExercises,
    data: res.data,
  });
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
    <Container py={5} maxW="container.md">
      <Stack spacing={5}>
        <HStack>
          <ButtonLink to={`/days/${DateTime.now().toFormat("yyyy-MM-dd")}`}>
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
              icon={<FontAwesomeIcon icon={faChevronLeft} />}
            />
          ) : (
            <ButtonLink to={`/days/${dayBefore.toFormat("yyyy-MM-dd")}`}>
              <FontAwesomeIcon icon={faChevronLeft} />{" "}
              {dayBefore.toFormat("yyyy-MM-dd")}
            </ButtonLink>
          )}

          <Spacer />
          <VStack textAlign="center" spacing={0}>
            <Heading>{day.toFormat("yyyy-MM-dd")}</Heading>
            <Box fontSize="xs" display={{ base: "none", sm: "block" }}>
              {day.toFormat("EEEE 'vecka' WW, kkkk", { locale: "sv" })}
            </Box>
          </VStack>
          <Spacer />

          {isSmallScreen ? (
            <IconButtonLink
              to={`/days/${dayAfter.toFormat("yyyy-MM-dd")}`}
              aria-label="Nästa dag"
              icon={<FontAwesomeIcon icon={faChevronRight} />}
            />
          ) : (
            <ButtonLink to={`/days/${dayAfter.toFormat("yyyy-MM-dd")}`}>
              {dayAfter.toFormat("yyyy-MM-dd")}
              <FontAwesomeIcon icon={faChevronRight} />
            </ButtonLink>
          )}
        </HStack>

        {polarEntries.length ? (
          <Stack>
            <Heading size="sm">Data från Polar</Heading>
            <Stack>
              {polarEntries.map((e) => (
                <Box key={e.id} bg="blue.50" borderRadius="md" padding={3}>
                  <Link to={`/connections/polar/exercise/${e.id}`}>
                    {DateTime.fromISO(e.startTime)
                      .setZone(timeZone)
                      .toFormat("HH:mm")}
                  </Link>
                </Box>
              ))}
            </Stack>
          </Stack>
        ) : null}

        <Stack>
          <Heading size="sm">Alla aktiviteter</Heading>
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
                          <Box>Primärt: {e.node.primaryPurpose.label}</Box>
                        ) : null}
                        {e.node.secondaryPurpose ? (
                          <Box>Sekundärt: {e.node.secondaryPurpose.label}</Box>
                        ) : null}
                        {e.node.description ? (
                          <Box>{e.node.description}</Box>
                        ) : null}
                        {e.node.comment ? <Box>{e.node.comment}</Box> : null}
                      </Wrap>
                      <Spacer />
                      <Box>
                        <ButtonLink
                          size="sm"
                          to={`/activities/create?from=${e.node.id}`}
                        >
                          Registrera
                        </ButtonLink>
                      </Box>
                      <Box>
                        <ButtonLink
                          size="sm"
                          variant="destructive"
                          to={`/planned-activities/${e.node.id}/delete`}
                        >
                          Radera
                        </ButtonLink>
                      </Box>
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
                          <LinkOverlay as={Link} to={`/exercises/${e.node.id}`}>
                            {DateTime.fromISO(e.node.start)
                              .setZone(timeZone)
                              .toFormat("HH:mm")}
                          </LinkOverlay>
                          {e.node.primaryPurpose ? (
                            <Box>Primärt: {e.node.primaryPurpose.label}</Box>
                          ) : null}
                          {e.node.secondaryPurpose ? (
                            <Box>
                              Sekundärt: {e.node.secondaryPurpose.label}
                            </Box>
                          ) : null}
                          {e.node.description ? (
                            <Box>{e.node.description}</Box>
                          ) : null}
                          {e.node.comment ? <Box>{e.node.comment}</Box> : null}
                        </Wrap>
                      </LinkBox>
                      <Spacer />
                      <Box>
                        <ButtonLink
                          size="sm"
                          variant="destructive"
                          to={`/activities/${e.node.id}/delete`}
                        >
                          Radera
                        </ButtonLink>
                      </Box>
                      <Box>
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
                      </Box>
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
