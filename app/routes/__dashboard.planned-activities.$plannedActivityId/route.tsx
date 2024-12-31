import { Outlet, useParams } from "@remix-run/react";
import { ButtonLink } from "~/components/button-link";
import { H1 } from "~/components/headings";
import { TitleHero, TitleHeroTabLink } from "~/components/ui/title-hero";

export default function PlannedActivity() {
  const { plannedActivityId } = useParams();

  return (
    <div>
      <TitleHero
        maxWidthClassName="max-w-screen-md"
        primaryAction={
          <ButtonLink
            size="sm"
            to={`/activities/create?from=${plannedActivityId}&now`}
          >
            Starta nu
          </ButtonLink>
        }
        title={<H1>Planerad aktivitet</H1>}
        tabs={[
          <TitleHeroTabLink
            key="overview"
            to={`/planned-activities/${plannedActivityId}`}
            end
          >
            Översikt
          </TitleHeroTabLink>,
          <TitleHeroTabLink
            key="exercises"
            to={`/planned-activities/${plannedActivityId}/exercises`}
            end
          >
            Övningar
          </TitleHeroTabLink>,
        ]}
      />

      <Outlet />
    </div>
  );
}
