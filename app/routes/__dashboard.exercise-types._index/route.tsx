import {
  Button,
  Stack,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";

import { z } from "zod";

import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, Link, useLoaderData } from "@remix-run/react";
import { authenticator } from "~/.server/auth.server";
import {
  AmountType,
  ExerciseTypesListDocument,
} from "~/graphql/generated/documents";
import { gql } from "~/graphql/graphql.server";

import { DateTime } from "luxon";
import { ButtonLink } from "~/components/button-link";
import { H1 } from "~/components/headings";
import { Container } from "~/components/ui/container";
import { TitleRow } from "~/components/ui/title-row";
import { db } from "~/db.server";

const schema = z.object({ id: z.string() });

export async function action({ request, params }: ActionFunctionArgs) {
  const { id: userId } = await authenticator.isAuthenticated(request, {
    failureRedirect: "/",
  });

  const data = await schema.parse(Object.fromEntries(await request.formData()));
  const exerciseType = await db.exerciseType.findFirstOrThrow({
    where: { id: data.id, userId, deletedAt: null },
  });
  if (!exerciseType) {
    throw new Error("Exercise type not found");
  }
  await db.exerciseType.update({
    where: { id: data.id },
    data: { deletedAt: DateTime.now().toJSDate() },
  });

  return redirect("/exercise-types");
}

export async function loader({ request, params }: LoaderFunctionArgs) {
  await authenticator.isAuthenticated(request, { failureRedirect: "/" });

  const res = await gql({
    document: ExerciseTypesListDocument,
    variables: {},
    request,
  });

  return json(res.data);
}

export default function Activity() {
  const data = useLoaderData<typeof loader>();

  return (
    <Container>
      <Stack spacing={5}>
        <TitleRow
          actions={
            <ButtonLink to="/exercise-types/create">Skapa ny</ButtonLink>
          }
        >
          <H1>Övningstyper</H1>
        </TitleRow>
        <TableContainer>
          <Table size="sm">
            <Thead>
              <Tr>
                <Th>Övningstyp</Th>
                <Th>Mängdtyp</Th>
                <Th>Variabla belastningar</Th>
                <Th w={1} />
              </Tr>
            </Thead>
            <Tbody>
              {data?.exerciseTypes.edges.map((edge) =>
                edge.node ? (
                  <Tr key={edge.cursor}>
                    <Td>
                      <Link
                        to={`/exercise-types/${edge.cursor}`}
                        className="font-bold"
                      >
                        {edge.node?.name || "-"}
                      </Link>
                    </Td>
                    <Td>
                      {edge.node?.defaultAmountType === AmountType.Repetitions
                        ? "Antal"
                        : edge.node?.defaultAmountType === AmountType.Levels
                        ? "Nivåer"
                        : edge.node.defaultAmountType === AmountType.Time
                        ? "Tid"
                        : "-"}
                    </Td>
                    <Td>
                      {edge.node?.loadTypes
                        .map((load) => `${load.name} (${load.unit ?? "-"})`)
                        .join(", ")}
                    </Td>
                    <Td>
                      <Form method="post">
                        <input type="hidden" name="id" value={edge.node.id} />
                        <Button variant="link" colorScheme="red" type="submit">
                          Radera
                        </Button>
                      </Form>
                    </Td>
                  </Tr>
                ) : null
              )}
            </Tbody>
          </Table>
        </TableContainer>
      </Stack>
    </Container>
  );
}
