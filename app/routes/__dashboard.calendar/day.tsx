import type { ButtonProps } from "@chakra-ui/react";
import {
  Box,
  Button,
  HStack,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Portal,
  Stack,
} from "@chakra-ui/react";
import { useLoaderData, useLocation, useNavigation } from "@remix-run/react";
import { DateTime, Duration, Interval } from "luxon";
import type { ReactNode } from "react";
import { forwardRef, useEffect, useRef } from "react";
import { ValidatedForm } from "remix-validated-form";
import { ButtonLink } from "~/components/button-link";
import { ValidatedSelectField } from "~/components/form/select";
import { SubmitButton } from "~/components/form/submit-button";
import { ValidatedTextareaField } from "~/components/form/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { FormStack } from "~/components/ui/form-stack";
import { InlineLink } from "~/components/ui/inline-link";
import type { CalendarDayFragment } from "~/graphql/generated/documents";
import { useToggle } from "~/hooks/use-toggle";
import { useReturnToUrl } from "~/services/return-to";
import { createPlannedActivityValidator } from "../__dashboard.planned-activities.create";
import type { loader } from "./route";

export function Day({
  day,
  opacity,
}: {
  day: CalendarDayFragment;
  opacity?: number;
}) {
  const { timeZone } = useLoaderData<typeof loader>();
  const start = DateTime.fromISO(day.start, { zone: timeZone });
  const isFuture = start.diffNow().toMillis() > 0;
  const isPast = start.diffNow().toMillis() < 0;
  const isToday = Interval.fromDateTimes(start, start.endOf("day")).contains(
    DateTime.now().setZone(timeZone)
  );

  const location = useLocation();
  const returnTo = useReturnToUrl();

  return (
    <Box h="7rem" opacity={opacity}>
      <Stack h="100%" spacing={0}>
        <Box
          fontSize="xs"
          textAlign="center"
          fontWeight="bold"
          display={["none", "block"]}
        >
          {day.date}
        </Box>
        <Box
          fontSize="xs"
          textAlign="center"
          fontWeight="bold"
          display={["block", "none"]}
        >
          {start.toFormat("dd")}
        </Box>
        <Popover>
          <PopoverTrigger>
            <DayPreview day={day} />
          </PopoverTrigger>

          <Portal>
            <PopoverContent>
              <PopoverArrow />
              <PopoverHeader>
                {start.toFormat("yyyy-MM-dd")}
                <PopoverCloseButton />
              </PopoverHeader>
              <PopoverBody>
                <Stack>
                  {day.activities.edges.map((activityEdge) =>
                    activityEdge.node ? (
                      <HStack key={activityEdge.cursor} alignItems="flex-start">
                        <Box fontWeight="bold">
                          {DateTime.fromISO(activityEdge.node.start, {
                            zone: timeZone,
                          }).toFormat("HH:mm")}
                        </Box>
                        <Stack spacing={0}>
                          <Box fontWeight="bold">
                            {activityEdge.node.__typename === "Exercise" ? (
                              <InlineLink
                                to={`/exercises/${activityEdge.node.id}`}
                              >
                                {activityEdge.node.title}
                              </InlineLink>
                            ) : activityEdge.node.__typename === "FogisGame" ||
                              activityEdge.node.__typename === "CustomGame" ? (
                              <InlineLink to={`/games/${activityEdge.node.id}`}>
                                {activityEdge.node.title}
                              </InlineLink>
                            ) : activityEdge.node.__typename ===
                              "PlannedExercise" ? (
                              <InlineLink
                                to={`/planned-activities/${activityEdge.node.id}`}
                              >
                                {activityEdge.node.title}
                              </InlineLink>
                            ) : (
                              <>{activityEdge.node.title}</>
                            )}
                          </Box>
                          {activityEdge.node.__typename === "Exercise" ? (
                            <>
                              {activityEdge.node.primaryPurpose ? (
                                <div>{`Primärt syfte: ${activityEdge.node.primaryPurpose.label}`}</div>
                              ) : null}
                              {activityEdge.node.secondaryPurpose ? (
                                <div>{`Sekundärt syfte: ${activityEdge.node.secondaryPurpose.label}`}</div>
                              ) : null}
                              {activityEdge.node.description ? (
                                <div>{`Beskrivning: ${activityEdge.node.description}`}</div>
                              ) : null}
                              {activityEdge.node.comment ? (
                                <div>{`Kommentar: ${activityEdge.node.comment}`}</div>
                              ) : null}
                            </>
                          ) : null}
                        </Stack>
                      </HStack>
                    ) : null
                  )}

                  {day.heartRateSummary?.secondsInZone4 ? (
                    <div>
                      Tid i zon 4:{" "}
                      {Duration.fromMillis(
                        day.heartRateSummary.secondsInZone4 * 1000
                      )
                        .shiftTo("minutes", "seconds")
                        .toFormat("m'min' ss's'")}
                    </div>
                  ) : null}
                  {day.heartRateSummary?.secondsInZone5 ? (
                    <div>
                      Tid i zon 5:{" "}
                      {Duration.fromMillis(
                        day.heartRateSummary.secondsInZone5 * 1000
                      )
                        .shiftTo("minutes", "seconds")
                        .toFormat("m'min' ss's'")}
                    </div>
                  ) : null}

                  <HStack
                    shouldWrapChildren
                    wrap="wrap"
                    gap={3}
                    rowGap={2}
                    spacing={0}
                  >
                    <ButtonLink
                      to={`/days/${start.toFormat("yyyy-MM-dd")}`}
                      size="sm"
                      className="flex-1"
                    >
                      Visa dag
                    </ButtonLink>
                    {isPast || isToday ? (
                      <ButtonLink
                        to={`/activities/create?date=${start.toFormat(
                          "yyyy-MM-dd"
                        )}&returnTo=${returnTo}`}
                        className="bg-green-600 flex-1"
                        size="sm"
                      >
                        Registrera
                      </ButtonLink>
                    ) : null}
                    {isFuture || isToday ? (
                      <PlanButton
                        colorScheme="green"
                        size="sm"
                        flex={1}
                        dayStart={start}
                      >
                        Planera
                      </PlanButton>
                    ) : null}

                    <ButtonLink
                      to={`/tests/create?date=${start.toFormat(
                        "yyyy-MM-dd"
                      )}&redirectTo=${location.pathname}`}
                      className="flex-1 bg-orange-600"
                      size="sm"
                    >
                      Löptest
                    </ButtonLink>

                    <ButtonLink
                      to={`/games/create?date=${start.toFormat(
                        "yyyy-MM-dd"
                      )}&redirectTo=${location.pathname}`}
                      className="flex-1 bg-red-600"
                      size="sm"
                    >
                      Match
                    </ButtonLink>

                    <ButtonLink
                      to={`/travel/create?date=${start.toFormat(
                        "yyyy-MM-dd"
                      )}&redirectTo=${location.pathname}`}
                      className="flex-1 bg-yellow-600"
                      size="sm"
                    >
                      Resa
                    </ButtonLink>
                  </HStack>
                </Stack>
              </PopoverBody>
            </PopoverContent>
          </Portal>
        </Popover>
      </Stack>
    </Box>
  );
}

function PlanButton({
  dayStart,
  ...props
}: ButtonProps & { dayStart: DateTime }) {
  const [modalOpen, { toggle, close }] = useToggle();
  const { state } = useNavigation();
  const lastState = useRef(state);
  const { purposes } = useLoaderData<typeof loader>();

  useEffect(() => {
    if (lastState.current === "submitting" && state !== "submitting") {
      close();
    }
    lastState.current = state;
  }, [close, state]);

  const location = useLocation();

  return (
    <>
      <Button {...props} onClick={toggle} />
      {modalOpen ? (
        <Dialog open onOpenChange={(isOpen) => (!isOpen ? close() : undefined)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Planera</DialogTitle>
              <DialogDescription>
                <ValidatedForm
                  validator={createPlannedActivityValidator}
                  method="post"
                  action={`/planned-activities/create?returnTo=${location.pathname}`}
                >
                  <input
                    type="hidden"
                    name="date"
                    value={dayStart
                      .set({ hour: 12 })
                      .toFormat("yyyy-MM-dd'T'HH:mm")}
                  />
                  <FormStack>
                    <ValidatedSelectField
                      label="Primärt syfte"
                      name="primaryPurposeId"
                      options={[
                        { value: "null", label: "Ej valt" },
                        ...purposes.map((purpose) => ({
                          value: purpose.id,
                          label: purpose.label,
                        })),
                      ]}
                    />
                    <ValidatedSelectField
                      label="Sekundärt syfte"
                      name="secondaryPurposeId"
                      options={[
                        { value: "null", label: "Ej valt" },
                        ...purposes.map((purpose) => ({
                          value: purpose.id,
                          label: purpose.label,
                        })),
                      ]}
                    />
                    <ValidatedTextareaField
                      label="Beskrivning/innehåll"
                      name="description"
                    />
                    <ValidatedTextareaField
                      label="Övriga kommentarer"
                      name="comment"
                    />
                  </FormStack>
                  <SubmitButton>Skapa</SubmitButton>
                </ValidatedForm>
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      ) : null}
    </>
  );
}

const DayPreview = forwardRef<HTMLButtonElement, { day: CalendarDayFragment }>(
  ({ day, ...props }, ref) => {
    const { timeZone } = useLoaderData<typeof loader>();
    const start = DateTime.fromISO(day.start, { zone: timeZone });
    const isFuture = start.diffNow().toMillis() > 0;
    const isPast = start.endOf("day").diffNow().toMillis() < 0;
    const dayInterval = Interval.fromDateTimes(start, start.endOf("day"));
    const isToday = dayInterval.contains(DateTime.now().setZone(timeZone));
    const generalProps = {
      borderWidth: isToday ? "thick" : undefined,
      opacity: isFuture ? 0.7 : undefined,
      ...props,
    };

    const activities = day.activities.edges
      .filter(
        (x) => x.node?.__typename !== "Exercise" || !x.node.isHiddenFromOverview
      )
      .flatMap((e) => (e.node ? [e.node] : []));

    if (
      activities.some(
        (a) => a.__typename === "FogisGame" || a.__typename === "CustomGame"
      )
    ) {
      return <GameDayPreview ref={ref} {...generalProps} />;
    }
    if (activities.some((a) => a.__typename === "PhysicalTest")) {
      return <TestDayPreview ref={ref} {...generalProps} />;
    }
    if (activities.some((a) => a.__typename === "Exercise")) {
      const purposes = activities
        .flatMap((a) =>
          a.__typename === "Exercise"
            ? [a.primaryPurpose, a.secondaryPurpose]
            : []
        )
        .filter(Boolean);
      const label =
        purposes.map((p) => p?.shortLabel || p?.label).join(" + ") || "Träning";

      return (
        <ExerciseDayPreview ref={ref} {...generalProps}>
          {label}
        </ExerciseDayPreview>
      );
    }

    if (activities.some((a) => a.__typename === "Travel")) {
      return <TravelDayPreview ref={ref} {...generalProps} />;
    }

    if (isPast) {
      return <RestDayPreview ref={ref} {...generalProps} />;
    }

    if (activities.some((a) => a.__typename === "PlannedExercise")) {
      const purposes = activities
        .flatMap((a) =>
          a.__typename === "PlannedExercise"
            ? [a.primaryPurpose, a.secondaryPurpose]
            : []
        )
        .filter(Boolean);
      const label =
        purposes.map((p) => p?.shortLabel || p?.label).join(" + ") || "Träning";

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
  }
);

const TestDayPreview = forwardRef<HTMLButtonElement, {}>((props, ref) => (
  <BasePreview
    bg="orange.500"
    _hover={{ bg: "orange.600" }}
    {...props}
    ref={ref}
  >
    Löptest
  </BasePreview>
));

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

const TravelDayPreview = forwardRef<HTMLButtonElement, {}>((props, ref) => (
  <BasePreview
    bg="yellow.500"
    color="black"
    _hover={{ bg: "yellow.600" }}
    {...props}
    ref={ref}
  >
    Resdag
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
    fontSize={["2xs", "xs"]}
    p={[0, 1]}
    {...props}
  />
));
