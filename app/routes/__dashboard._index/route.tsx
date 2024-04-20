import type { ButtonProps } from "@chakra-ui/react";
import { Container, SimpleGrid } from "@chakra-ui/react";

import type { ReactNode } from "react";
import { ButtonLink } from "~/components/button-link";

export default function Index() {
  return (
    <Container py={6}>
      <SimpleGrid minChildWidth={250} gap={4}>
        <Item to={`/exercises/live`} colorScheme="green">
          Träna nu
        </Item>
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
