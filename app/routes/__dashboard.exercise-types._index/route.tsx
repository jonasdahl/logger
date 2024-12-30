import { Stack } from "@chakra-ui/react";

import { z } from "zod";

import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
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
import { Button } from "~/components/ui/button";
import { Container } from "~/components/ui/container";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
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

  return res.data;
}

export default function Activity() {
  const data = useLoaderData<typeof loader>();

  return (
    <Container>
      <Stack spacing={5}>
        <TitleRow
          actions={
            <ButtonLink to="/exercise-types/create" variant="outline">
              Skapa ny
            </ButtonLink>
          }
        >
          <H1>Övningstyper</H1>
        </TitleRow>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="truncate">Övningstyp</TableHead>
              <TableHead className="truncate">Mängdtyp</TableHead>
              <TableHead className="truncate">Belastningar</TableHead>
              <TableHead className="w-1" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.exerciseTypes.edges.map((edge) =>
              edge.node ? (
                <TableRow key={edge.cursor}>
                  <TableCell className="truncate max-w-sm">
                    <Link
                      to={`/exercise-types/${edge.cursor}`}
                      className="font-bold truncate"
                    >
                      {edge.node?.name || "-"}
                    </Link>
                  </TableCell>
                  <TableCell>
                    {edge.node?.defaultAmountType === AmountType.Repetitions
                      ? "Antal"
                      : edge.node?.defaultAmountType === AmountType.Levels
                      ? "Nivåer"
                      : edge.node.defaultAmountType === AmountType.Time
                      ? "Tid"
                      : "-"}
                  </TableCell>
                  <TableCell>
                    {edge.node?.loadTypes
                      .map((load) => `${load.name} (${load.unit ?? "-"})`)
                      .join(", ")}
                  </TableCell>
                  <TableCell>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="destructive-link" size="inline">
                          Radera
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Radera "{edge.node.name}"?</DialogTitle>
                        </DialogHeader>
                        <DialogFooter>
                          <Form method="post">
                            <input
                              type="hidden"
                              name="id"
                              value={edge.node.id}
                            />
                            <Button type="submit" variant="destructive">
                              Radera
                            </Button>
                          </Form>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                </TableRow>
              ) : null
            )}
          </TableBody>
        </Table>
      </Stack>
    </Container>
  );
}
