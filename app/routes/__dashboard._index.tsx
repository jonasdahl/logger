import type { ButtonProps } from "@chakra-ui/react";
import {
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
import { ActivityType } from "@prisma/client";
import type { LoaderArgs, SerializeFrom } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, useLoaderData, useNavigation } from "@remix-run/react";
import { groupBy } from "lodash";
import { DateTime, Interval } from "luxon";
import { forwardRef } from "react";
import { authenticator } from "~/auth.server";
import { db } from "~/db.server";
import { useToggle } from "~/hooks/use-toggle";
import { getSessionFromRequest } from "~/session.server";

export async function loader({ request }: LoaderArgs) {
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  });
  const data = await getSessionFromRequest(request);

  const games = await db.game.findMany({
    where: {
      userId: user.id,
      time: {
        gte: DateTime.now().minus({ weeks: 2 }).toJSDate(),
        lte: DateTime.now().plus({ weeks: 2 }).toJSDate(),
      },
    },
  });

  const otherActivities = await db.activity.findMany({
    where: {
      userId: user.id,
      time: {
        gte: DateTime.now().minus({ weeks: 2 }).toJSDate(),
        lte: DateTime.now().plus({ weeks: 2 }).toJSDate(),
      },
    },
  });

  const activities = [
    ...games.map((game) => ({
      key: `game:${game.id}`,
      type: "game" as const,
      game,
      day: DateTime.fromJSDate(game.time).startOf("day"),
    })),
    ...otherActivities.map((activity) => {
      switch (activity.type) {
        case ActivityType.Exercise:
          return {
            key: `exercise:${activity.id}`,
            type: "exercise" as const,
            day: DateTime.fromJSDate(activity.time),
            activity,
          };
        case ActivityType.Game:
          return {
            key: `game:${activity.id}`,
            type: "game" as const,
            day: DateTime.fromJSDate(activity.time),
            activity,
          };
        case ActivityType.Rest:
          return {
            key: `rest:${activity.id}`,
            type: "rest" as const,
            day: DateTime.fromJSDate(activity.time),
            activity,
          };
        default:
          throw new Error(`Unknown activity type: ${activity.type}`);
      }
    }),
  ];

  const activitiesByDay = groupBy(activities, (a) => a.day.toISO());

  return json({
    polarAccessToken: data.get("polarAccessToken"),
    polarUserId: data.get("polarUserId"),
    games,
    activities,
    activitiesByDay,
  });
}

type Activity = SerializeFrom<typeof loader>["activities"][number];

export default function DashboardIndex() {
  const { activitiesByDay } = useLoaderData<typeof loader>();
  const now = DateTime.now();
  const startOfWeek = now.startOf("week");
  const startOfPreviousWeek = startOfWeek.minus({ weeks: 2 });
  const endOfWeek = now.endOf("week");
  const endOfPeriod = endOfWeek.plus({ weeks: 2 });
  const interval = Interval.fromDateTimes(startOfPreviousWeek, endOfPeriod);
  const days = interval.splitBy({ days: 1 });

  return (
    <Container maxW="container.lg" py={5}>
      <SimpleGrid columns={[1, 3, 7]} rowGap={2} columnGap={1}>
        {days.map((day) => (
          <Day
            key={day.start.toMillis()}
            day={day}
            activities={activitiesByDay[day.start.toISO()] ?? []}
          />
        ))}
      </SimpleGrid>
    </Container>
  );
}

function Day({ day, activities }: { day: Interval; activities: Activity[] }) {
  const isFuture = day.start.diffNow().toMillis() > 0;
  const isPast = day.start.diffNow().toMillis() < 0;
  const isToday = day.contains(DateTime.now());

  return (
    <Box h="7rem">
      <Stack h="100%" spacing={0}>
        <Box fontSize="xs" textAlign="center" fontWeight="bold">
          {day.start.toFormat("yyyy-MM-dd")}
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
                  <HStack key={activity.key}>
                    <Box>{activity.type}</Box>
                    <Spacer />
                    <Button size="sm" colorScheme="red">
                      Radera
                    </Button>
                  </HStack>
                ))}
                <HStack w="100%">
                  {isPast || isToday ? (
                    <Button colorScheme="green" size="sm" flex={1}>
                      Registrera
                    </Button>
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

  return (
    <>
      <Button {...props} onClick={toggle} />
      <Modal isOpen={modalOpen} onClose={close}>
        <ModalOverlay />

        <ModalContent>
          <Form action="/api/create-plan" method="post">
            <ModalHeader>
              Planera
              <ModalCloseButton />
            </ModalHeader>
            <ModalBody>
              <input type="hidden" name="day" value={day.start.toISO()} />
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
    </>
  );
}

const DayPreview = forwardRef<
  HTMLButtonElement,
  {
    day: Interval;
    activities: Activity[];
  }
>(({ day, activities, ...props }, ref) => {
  if (activities.some((a) => a.type === "game")) {
    return <GameDayPreview ref={ref} {...props} />;
  }
  if (activities.some((a) => a.type === "rest")) {
    return <RestDayPreview ref={ref} {...props} />;
  }
  if (activities.some((a) => a.type === "exercise")) {
    return <ExerciseDayPreview ref={ref} {...props} />;
  }
  return (
    <BasePreview
      bg="gray.500"
      _hover={{ bg: "gray.600" }}
      ref={ref}
      {...props}
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

const ExerciseDayPreview = forwardRef<HTMLButtonElement, {}>((props, ref) => (
  <BasePreview bg="blue.700" _hover={{ bg: "blue.800" }} {...props} ref={ref}>
    Träning
  </BasePreview>
));

const BasePreview = forwardRef<HTMLButtonElement, ButtonProps>((props, ref) => (
  <Button
    ref={ref}
    borderRadius="xl"
    flexGrow={1}
    borderColor="blue.900"
    color="white"
    {...props}
  />
));
