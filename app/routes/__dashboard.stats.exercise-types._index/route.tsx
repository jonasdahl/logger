import type { LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { authenticator } from "~/.server/auth.server";
import { ButtonLink } from "~/components/button-link";
import { H1 } from "~/components/headings";
import { Container } from "~/components/ui/container";
import { StatsExercisesDocument } from "~/graphql/generated/documents";
import { gql } from "~/graphql/graphql.server";

export async function loader({ request, params }: LoaderFunctionArgs) {
  await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  });

  const res = await gql({
    document: StatsExercisesDocument,
    request,
    variables: {},
  });

  return res.data;
}

export default function DashboardIndex() {
  const data = useLoaderData<typeof loader>();

  return (
    <Container className="flex flex-col gap-3">
      <H1>Statistik</H1>
      <div className="grid gap-2 grid-cols-2 md:grid-cols-4">
        {data?.exerciseTypes?.edges?.map((type) => (
          <ButtonLink
            to={`/stats/exercise-types/${type.node?.id}`}
            key={type.cursor}
            variant="outline"
          >
            {type.node?.name}
          </ButtonLink>
        ))}
      </div>
    </Container>
  );
}
