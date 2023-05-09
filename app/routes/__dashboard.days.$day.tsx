import {
  Box,
  Container,
  HStack,
  Heading,
  Spacer,
  Stack,
  VStack,
} from "@chakra-ui/react";
import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { DateTime } from "luxon";
import { z } from "zod";
import { authenticator } from "~/auth.server";
import { ButtonLink } from "~/components/button-link";

const dayType = z
  .string()
  .transform((s) => DateTime.fromFormat(s, "yyyy-MM-dd"));
const paramsType = z.object({ day: dayType });

export async function loader({ request, params }: LoaderArgs) {
  const { day } = paramsType.parse(params);
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  });

  return json({ dayString: day.toFormat("yyyy-MM-dd"), user });
}

export default function DashboardIndex() {
  const { dayString } = useLoaderData<typeof loader>();
  const day = dayType.parse(dayString);
  const dayBefore = day.minus({ days: 1 });
  const dayAfter = day.plus({ days: 1 });

  return (
    <Container py={5}>
      <Stack>
        <HStack>
          <ButtonLink to={`/days/${dayBefore.toFormat("yyyy-MM-dd")}`}>
            {dayBefore.toFormat("yyyy-MM-dd")}
          </ButtonLink>
          <Spacer />
          <VStack textAlign="center">
            <Heading>{day.toFormat("yyyy-MM-dd")}</Heading>
            <Box>{day.toFormat("EEEE 'vecka' WW, kkkk", { locale: "sv" })}</Box>
          </VStack>
          <Spacer />
          <ButtonLink to={`/days/${dayAfter.toFormat("yyyy-MM-dd")}`}>
            {dayAfter.toFormat("yyyy-MM-dd")}
          </ButtonLink>
        </HStack>

        <Heading size="sm">Data från Polars</Heading>
      </Stack>
    </Container>
  );
}
