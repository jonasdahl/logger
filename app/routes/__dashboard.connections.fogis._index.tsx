import {
  Button,
  Checkbox,
  Container,
  Heading,
  Stack,
  Table,
  TableContainer,
  Tbody,
  Td,
  Tr,
} from "@chakra-ui/react";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import {
  Form,
  useActionData,
  useLoaderData,
  useNavigation,
} from "@remix-run/react";
import { withZod } from "@remix-validated-form/with-zod";
import { DateTime, Interval } from "luxon";
import { ValidatedForm } from "remix-validated-form";
import { z } from "zod";
import { authenticator } from "~/.server/auth.server";
import { SubmitButton } from "~/components/form/submit-button";
import { validate } from "~/components/form/validate.server";
import { ValidatedInputField } from "~/components/form/validated-input-field";
import { db } from "~/db.server";
import { FogisClient } from "~/fogis/client.server";

const validator = withZod(
  z.object({
    username: z.string().min(1, "Vänligen ange ett användarnamn"),
    password: z.string().min(1, "Vänligen ange ett lösenord"),
  })
);

export async function loader({ request }: LoaderFunctionArgs) {
  const userSession = await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  });

  const user = await db.user.findFirstOrThrow({
    where: { id: userSession.id, deletedAt: null },
  });

  return json({ fogisUsername: user.fogisUsername });
}

export async function action({ request }: ActionFunctionArgs) {
  const { username, password } = await validate({ request, validator });

  const syncStart = DateTime.now().minus({ days: 30 });
  const syncEnd = DateTime.now().plus({ years: 1 });
  const syncInterval = Interval.fromDateTimes(syncStart, syncEnd);
  const usersGames = await db.fogisGame.findMany({
    where: {
      time: { gte: syncStart.toJSDate(), lte: syncEnd.toJSDate() },
      deletedAt: null,
    },
  });

  const fogisClient = new FogisClient({
    auth: { username, password },
  });
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  });

  await db.user.update({
    where: { id: user.id },
    data: { fogisUsername: username },
  });

  await fogisClient.login();
  const foundGames = await fogisClient
    .getGames()
    .then((games) => games.filter((game) => syncInterval.contains(game.time)));

  const toDelete = usersGames.filter((previouslySyncedGame) => {
    return !foundGames.some(
      (fogisGame) => fogisGame.id === previouslySyncedGame.gameId
    );
  });
  const toAdd = foundGames.filter((foundGame) => {
    return !usersGames.some(
      (previouslySyncedGame) => previouslySyncedGame.gameId === foundGame.id
    );
  });

  // TODO Update

  return json({ foundGames, toDelete, toAdd, toUpdate: [] });
}

export default function Fogis() {
  const { fogisUsername } = useLoaderData<typeof loader>();

  const actionData = useActionData<typeof action>();
  const { state } = useNavigation();

  if (actionData) {
    return (
      <Container py={5} maxW="container.lg">
        <Form method="post" action="/connections/fogis/save">
          <Stack spacing={6}>
            <Heading>Granska import</Heading>
            <Stack>
              <Heading size="md">Matcher som kommer läggas till</Heading>
              {actionData.toAdd.length === 0 ? (
                <div>Inga nya matcher.</div>
              ) : (
                <TableContainer>
                  <Table size="sm">
                    <Tbody>
                      {actionData.toAdd.map((game) => (
                        <Tr key={game.id}>
                          <Td w={1} pr={0}>
                            <Checkbox
                              name="add"
                              value={game.id}
                              defaultChecked
                            />
                          </Td>
                          <Td>
                            {DateTime.fromISO(game.time!).toFormat(
                              "yyyy-MM-dd HH:mm"
                            )}
                            <input
                              type="hidden"
                              name={`toAdd[${game.id}]`}
                              value={JSON.stringify(game)}
                            />
                          </Td>
                          <Td>
                            {game.homeTeam.name}-{game.awayTeam.name}
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </TableContainer>
              )}
            </Stack>

            <Stack>
              <Heading size="md">Matcher som kommer tas bort</Heading>
              {actionData.toDelete.length === 0 ? (
                <div>Inga matcher tas bort.</div>
              ) : (
                <TableContainer>
                  <Table size="sm">
                    <Tbody>
                      {actionData.toDelete.map((game) => (
                        <Tr key={game.id}>
                          <Td w={1} pr={0}>
                            <Checkbox
                              name="delete"
                              value={game.id}
                              defaultChecked
                            />
                          </Td>
                          <Td>
                            {DateTime.fromISO(game.time).toFormat(
                              "yyyy-MM-dd HH:mm"
                            )}
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </TableContainer>
              )}
            </Stack>

            <div>
              <Button
                type="submit"
                colorScheme="green"
                isLoading={state === "submitting"}
                isDisabled={state === "submitting"}
              >
                Genomför ändringar
              </Button>
            </div>
          </Stack>
        </Form>
      </Container>
    );
  }

  return (
    <Container py={6}>
      <Stack spacing={5}>
        <Heading>Importera från Fogis</Heading>
        <div>
          Fyll i dina inloggningsuppgifter till Fogis nedan så importeras dina
          matcher automatiskt.
        </div>
        <ValidatedForm validator={validator} method="post">
          <Stack spacing={5}>
            <ValidatedInputField
              name="username"
              label="Användarnamn i Fogis"
              defaultValue={fogisUsername ?? undefined}
              autoFocus={!fogisUsername}
            />
            <ValidatedInputField
              name="password"
              type="password"
              label="Lösenord i Fogis"
              autoFocus={!!fogisUsername}
            />
            <div>
              <SubmitButton variant="secondary">Hämta matcher</SubmitButton>
            </div>
          </Stack>
        </ValidatedForm>
      </Stack>
    </Container>
  );
}
