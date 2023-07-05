import type { ButtonProps } from "@chakra-ui/react";
import {
  Box,
  Button,
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
  Stack,
} from "@chakra-ui/react";
import { useLoaderData, useNavigation } from "@remix-run/react";
import { DateTime, Interval } from "luxon";
import type { ReactNode } from "react";
import { forwardRef, useEffect, useRef } from "react";
import { ValidatedForm } from "remix-validated-form";
import { ButtonLink } from "~/components/button-link";
import { Select } from "~/components/form/select";
import { SubmitButton } from "~/components/form/submit-button";
import { Textarea } from "~/components/form/textarea";
import type { CalendarDayFragment } from "~/graphql/generated/documents";
import { useToggle } from "~/hooks/use-toggle";
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
                    <Box key={activityEdge.cursor}>
                      {DateTime.fromISO(activityEdge.node.start, {
                        zone: timeZone,
                      }).toFormat("HH:mm")}{" "}
                      {activityEdge.node.title}
                    </Box>
                  ) : null
                )}
                <HStack w="100%">
                  <ButtonLink
                    to={`/days/${start.toFormat("yyyy-MM-dd")}`}
                    size="sm"
                    flex={1}
                  >
                    Visa dag
                  </ButtonLink>
                  {isPast || isToday ? (
                    <ButtonLink
                      to={`/activities/create?date=${start.toFormat(
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
                      dayStart={start}
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

  return (
    <>
      <Button {...props} onClick={toggle} />
      {modalOpen ? (
        <Modal isOpen onClose={close}>
          <ModalOverlay />

          <ModalContent>
            <ValidatedForm
              validator={createPlannedActivityValidator}
              method="post"
              action="/planned-activities/create?returnTo=/calendar"
            >
              <ModalHeader>
                Planera
                <ModalCloseButton />
              </ModalHeader>
              <ModalBody>
                <input
                  type="hidden"
                  name="date"
                  value={dayStart
                    .set({ hour: 12 })
                    .toFormat("yyyy-MM-dd'T'HH:mm")}
                />
                <Stack>
                  <Select label="Primärt syfte" name="primaryPurposeId">
                    <option value="null">Ej valt</option>
                    {purposes.map((purpose) => (
                      <option key={purpose.id} value={purpose.id}>
                        {purpose.label}
                      </option>
                    ))}
                  </Select>
                  <Select label="Sekundärt syfte" name="secondaryPurposeId">
                    <option value="null">Ej valt</option>
                    {purposes.map((purpose) => (
                      <option key={purpose.id} value={purpose.id}>
                        {purpose.label}
                      </option>
                    ))}
                  </Select>
                  <Textarea label="Beskrivning/innehåll" name="description" />
                  <Textarea label="Övriga kommentarer" name="comment" />
                </Stack>
              </ModalBody>
              <ModalFooter>
                <SubmitButton>Skapa</SubmitButton>
              </ModalFooter>
            </ValidatedForm>
          </ModalContent>
        </Modal>
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

    if (activities.some((a) => a.__typename === "FogisGame")) {
      return <GameDayPreview ref={ref} {...generalProps} />;
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
    fontSize={["2xs", "xs"]}
    p={[0, 1]}
    {...props}
  />
));
