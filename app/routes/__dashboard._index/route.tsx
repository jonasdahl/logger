import type { ButtonProps } from "@chakra-ui/react";
import { Container, SimpleGrid } from "@chakra-ui/react";

import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { DateTime } from "luxon";
import type { ReactNode } from "react";
import { ButtonLink } from "~/components/button-link";
import { getTimeZoneFromRequest } from "~/time";

export async function loader({ request, params }: LoaderFunctionArgs) {
  const timeZone = await getTimeZoneFromRequest(request);
  return json({ timeZone });
}

export default function Index() {
  const { timeZone } = useLoaderData<typeof loader>();

  return (
    <Container py={6}>
      <SimpleGrid minChildWidth={250} gap={4}>
        <Item
          to={`/months/${DateTime.now()
            .setZone(timeZone)
            .toFormat("yyyy'/'MM")}`}
        >
          Månadsvy
        </Item>

        <Item to={`/stats/exercise-types`}>Stats</Item>

        <Item to={`/exercise-types`}>Övningstyper</Item>

        <Item to={`/exercises/live`} colorScheme="green">
          Träna nu
        </Item>

        <Item to={`/laws/quiz`}>Regelträning</Item>
      </SimpleGrid>
    </Container>
  );
}

function Item({
  to,
  children,
  colorScheme,
}: {
  to: string;
  children: ReactNode;
  colorScheme?: ButtonProps["colorScheme"];
}) {
  return (
    <ButtonLink to={to} colorScheme={colorScheme}>
      {children}
    </ButtonLink>
  );
}
