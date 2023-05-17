import type { ButtonProps } from "@chakra-ui/react";
import {
  Alert,
  AlertTitle,
  Box,
  Button,
  Container,
  HStack,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Select,
  SimpleGrid,
  Spacer,
  Stack,
} from "@chakra-ui/react";
import type { LoaderArgs, SerializeFrom } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, useLoaderData, useNavigation } from "@remix-run/react";
import { groupBy } from "lodash";
import { DateTime, Interval } from "luxon";
import type { ReactNode } from "react";
import { forwardRef, useEffect, useRef } from "react";
import { authenticator } from "~/auth.server";
import { ButtonLink } from "~/components/button-link";
import { db } from "~/db.server";
import { useToggle } from "~/hooks/use-toggle";
import { getTimeZoneFromRequest } from "~/time";

export async function loader({ request }: LoaderArgs) {
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  });

  const timeZone = getTimeZoneFromRequest(request);
  const now = DateTime.now().setZone(timeZone);
  const timeFilter = {
    gte: now.minus({ weeks: 2 }).toJSDate(),
    lte: now.plus({ weeks: 2 }).toJSDate(),
  };

  const fullUser = await db.user.findUniqueOrThrow({
    where: { id: user.id },
    include: {
      fogisGames: {
        where: { time: timeFilter, deletedAt: null },
      },
      activities: {
        where: { time: timeFilter, deletedAt: null },
        include: {
          primaryPurpose: true,
          secondaryPurpose: true,
        },
      },
      plannedActivities: {
        where: { time: timeFilter, deletedAt: null },
        include: {
          primaryPurpose: true,
          secondaryPurpose: true,
        },
      },
    },
  });

  const activities = [
    ...fullUser.fogisGames.map((game) => ({
      key: `game:${game.id}`,
      type: "game" as const,
      game,
      day: DateTime.fromJSDate(game.time, { zone: timeZone }).startOf("day"),
    })),
    ...fullUser.activities.map((activity) => {
      return {
        key: `exercise:${activity.id}`,
        type: "exercise" as const,
        day: DateTime.fromJSDate(activity.time, { zone: timeZone }),
        activity,
      };
    }),
    ...fullUser.plannedActivities.map((activity) => {
      return {
        key: `exercise:${activity.id}`,
        type: "exercise" as const,
        day: DateTime.fromJSDate(activity.time, { zone: timeZone }),
        activity,
      };
    }),
  ];

  const activitiesByDay = groupBy(activities, (a) =>
    a.day.startOf("day").toISO()
  );

  const realUser = await db.user.findUniqueOrThrow({ where: { id: user.id } });

  return json({
    activities,
    activitiesByDay,
    timeZone,
    showOnboarding: !realUser.onboardedAt,
    showFogisSync:
      realUser.lastFogisSync &&
      DateTime.fromJSDate(realUser.lastFogisSync).diffNow().as("weeks") < -1,
  });
}

type Activity = SerializeFrom<typeof loader>["activities"][number];

export default function DashboardIndex() {
  const { activitiesByDay, timeZone, showOnboarding, showFogisSync } =
    useLoaderData<typeof loader>();
  const now = DateTime.now().setZone(timeZone);
  const startOfWeek = now.startOf("week");
  const startOfPreviousWeek = startOfWeek.minus({ weeks: 2 });
  const endOfWeek = now.endOf("week");
  const endOfPeriod = endOfWeek.plus({ weeks: 2 });
  const interval = Interval.fromDateTimes(startOfPreviousWeek, endOfPeriod);
  const days = interval.splitBy({ days: 1 });

  return (
    <Container maxW="container.lg" py={5}>
      <Stack spacing={5}>
        {showOnboarding ? (
          <Alert>
            <HStack w="100%">
              <AlertTitle>
                Börja med att sätta upp anslutningar till tredjepartsappar.
              </AlertTitle>
              <Spacer />
              <Box>
                <ButtonLink size="sm" colorScheme="blue" to="/connections">
                  Kom igång
                </ButtonLink>
              </Box>
            </HStack>
          </Alert>
        ) : null}

        {showFogisSync ? (
          <Alert>
            <HStack w="100%">
              <AlertTitle>
                Det var mer än en vecka sedan du synkade mot Fogis.
              </AlertTitle>
              <Spacer />
              <Box>
                <ButtonLink
                  size="sm"
                  colorScheme="blue"
                  to="/connections/fogis"
                >
                  Gör det nu
                </ButtonLink>
              </Box>
            </HStack>
          </Alert>
        ) : null}

        <SimpleGrid columns={7} rowGap={2} columnGap={1}>
          {days.map((day) => (
            <Day
              key={day.start.toMillis()}
              day={day}
              activities={activitiesByDay[day.start.toISO()] ?? []}
            />
          ))}
        </SimpleGrid>
      </Stack>
    </Container>
  );
}

function Day({ day, activities }: { day: Interval; activities: Activity[] }) {
  const isFuture = day.start.diffNow().toMillis() > 0;
  const isPast = day.start.diffNow().toMillis() < 0;
  const { timeZone } = useLoaderData<typeof loader>();
  const isToday = day.contains(DateTime.now().setZone(timeZone));

  return (
    <Box h="7rem">
      <Stack h="100%" spacing={0}>
        <Box
          fontSize="xs"
          textAlign="center"
          fontWeight="bold"
          display={["none", "block"]}
        >
          {day.start.toFormat("yyyy-MM-dd")}
        </Box>
        <Box
          fontSize="xs"
          textAlign="center"
          fontWeight="bold"
          display={["block", "none"]}
        >
          {day.start.toFormat("dd")}
        </Box>
        <Popover>
          <PopoverTrigger>
            <DayPreview day={day} activities={activities} />
          </PopoverTrigger>

          <PopoverContent>
            <PopoverArrow />
            <PopoverHeader>
              {day.start.toFormat("yyyy-MM-dd")}
              <PopoverCloseButton />
            </PopoverHeader>
            <PopoverBody>
              <Stack>
                {activities.map((activity) => (
                  <Box key={activity.key}>
                    {activity.type === "game"
                      ? `Match: ${activity.game.homeTeam} - ${activity.game.awayTeam}`
                      : activity.type === "exercise"
                      ? "Träning"
                      : "Vila"}
                  </Box>
                ))}
                <HStack w="100%">
                  <ButtonLink
                    to={`/days/${day.start.toFormat("yyyy-MM-dd")}`}
                    size="sm"
                    flex={1}
                  >
                    Visa dag
                  </ButtonLink>
                  {isPast || isToday ? (
                    <ButtonLink
                      to={`/activities/create?date=${day.start.toFormat(
                        "yyyy-MM-dd"
                      )}`}
                      colorScheme="green"
                      size="sm"
                      flex={1}
                    >
                      Registrera
                    </ButtonLink>
                  ) : null}
                  {isFuture || isToday ? (
                    <PlanButton
                      colorScheme="green"
                      size="sm"
                      flex={1}
                      day={day}
                    >
                      Planera
                    </PlanButton>
                  ) : null}
                </HStack>
              </Stack>
            </PopoverBody>
          </PopoverContent>
        </Popover>
      </Stack>
    </Box>
  );
}

function PlanButton({ day, ...props }: ButtonProps & { day: Interval }) {
  const [modalOpen, { toggle, close }] = useToggle();
  const { state } = useNavigation();
  const lastState = useRef(state);

  useEffect(() => {
    if (lastState.current === "submitting" && state !== "submitting") {
      close();
    }
    lastState.current = state;
  }, [close, state]);

  return (
    <>
      <Button {...props} onClick={toggle} />
      {modalOpen ? (
        <Modal isOpen onClose={close}>
          <ModalOverlay />

          <ModalContent>
            <Form action="/api/create-plan" method="post">
              <ModalHeader>
                Planera
                <ModalCloseButton />
              </ModalHeader>
              <ModalBody>
                <input
                  type="hidden"
                  name="day"
                  value={day.start.toFormat("yyyy-MM-dd")}
                />
                <Select name="type">
                  <option value="rest">Vila</option>
                  <option value="exercise">Träning</option>
                  <option value="game">Match</option>
                </Select>
              </ModalBody>
              <ModalFooter>
                <Button type="submit" isLoading={state === "submitting"}>
                  Skapa
                </Button>
              </ModalFooter>
            </Form>
          </ModalContent>
        </Modal>
      ) : null}
    </>
  );
}

const DayPreview = forwardRef<
  HTMLButtonElement,
  { day: Interval; activities: Activity[] }
>(({ day, activities, ...props }, ref) => {
  const { timeZone } = useLoaderData<typeof loader>();
  const generalProps = {
    borderWidth: day.contains(DateTime.now().setZone(timeZone))
      ? "thick"
      : undefined,
    opacity: day.start.diffNow().toMillis() > 0 ? 0.7 : undefined,
    ...props,
  };

  if (activities.some((a) => a.type === "game")) {
    return <GameDayPreview ref={ref} {...generalProps} />;
  }
  if (activities.some((a) => a.type === "rest")) {
    return <RestDayPreview ref={ref} {...generalProps} />;
  }
  if (activities.some((a) => a.type === "exercise")) {
    const purposes = activities
      .flatMap((a) =>
        a.type === "exercise"
          ? [a.activity.primaryPurpose, a.activity.secondaryPurpose]
          : []
      )
      .filter(Boolean);
    const label = purposes.map((p) => p?.label).join(" + ") || "Träning";

    return (
      <ExerciseDayPreview ref={ref} {...generalProps}>
        {label}
      </ExerciseDayPreview>
    );
  }
  return (
    <BasePreview
      bg="gray.500"
      _hover={{ bg: "gray.600" }}
      ref={ref}
      {...generalProps}
    />
  );
});

const GameDayPreview = forwardRef<HTMLButtonElement, {}>((props, ref) => (
  <BasePreview bg="red.500" _hover={{ bg: "red.600" }} {...props} ref={ref}>
    Match
  </BasePreview>
));

const RestDayPreview = forwardRef<HTMLButtonElement, {}>((props, ref) => (
  <BasePreview bg="green.500" _hover={{ bg: "green.600" }} {...props} ref={ref}>
    Vila
  </BasePreview>
));

const ExerciseDayPreview = forwardRef<
  HTMLButtonElement,
  { children: ReactNode }
>((props, ref) => (
  <BasePreview bg="blue.700" _hover={{ bg: "blue.800" }} {...props} ref={ref}>
    {props.children ?? "Träning"}
  </BasePreview>
));

const BasePreview = forwardRef<HTMLButtonElement, ButtonProps>((props, ref) => (
  <Button
    ref={ref}
    borderRadius="xl"
    flexGrow={1}
    borderColor="blue.900"
    color="white"
    whiteSpace="normal"
    wordBreak="break-word"
    fontSize={[0, "sm"]}
    {...props}
  />
));
