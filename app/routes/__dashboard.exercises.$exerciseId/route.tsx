import type { LoaderFunctionArgs } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";
import { DateTime } from "luxon";
import { ButtonLink } from "~/components/button-link";
import { H1 } from "~/components/headings";
import { TitleHero, TitleHeroTabLink } from "~/components/ui/title-hero";
import { ExerciseLayoutDocument } from "~/graphql/generated/documents";
import { gqlData } from "~/graphql/graphql.server";

export async function loader({ request, params }: LoaderFunctionArgs) {
  return gqlData({
    document: ExerciseLayoutDocument,
    variables: { exerciseId: params.exerciseId! },
    request,
    requiredProperties: ["exercise"],
  });
}

export default function Activity() {
  const { exercise, timeZone } = useLoaderData<typeof loader>();

  return (
    <div>
      <TitleHero
        maxWidthClassName="max-w-screen-md"
        title={<H1>Träningspass</H1>}
        tabs={[
          <TitleHeroTabLink key="overview" to="." end>
            Översikt
          </TitleHeroTabLink>,
          <TitleHeroTabLink key="exercises" to="exercises">
            Övningar
          </TitleHeroTabLink>,
          exercise?.fromPlannedActivity ? (
            <TitleHeroTabLink key="plan" to="plan">
              Plan
            </TitleHeroTabLink>
          ) : null,
          exercise?.fromPlannedActivity ? (
            <TitleHeroTabLink key="timeline" to="timeline">
              Tidslinje
            </TitleHeroTabLink>
          ) : null,
        ].filter(Boolean)}
        primaryAction={
          <ButtonLink
            variant="outline"
            to={`/days/${DateTime.fromISO(exercise.start)
              .setZone(timeZone)
              .toFormat("yyyy-MM-dd")}`}
          >
            Visa dag
          </ButtonLink>
        }
      />
      <Outlet />
    </div>
  );
}
