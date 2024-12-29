import { faCog } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { GoalTimeType } from "@prisma/client";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { withZod } from "@remix-validated-form/with-zod";
import { DateTime } from "luxon";
import { z } from "zod";
import { authenticator } from "~/.server/auth.server";
import { validate } from "~/components/form/validate.server";
import { H1 } from "~/components/headings";
import { IconButtonLink } from "~/components/icon-button-link";
import { Progress } from "~/components/ui/progress";
import { TitleRow } from "~/components/ui/title-row";
import { db } from "~/db.server";
import { GoalDetailsDocument } from "~/graphql/generated/documents";
import { gql } from "~/graphql/graphql.server";

const GoalType = {
  PerformExerciseType: "PerformExerciseType",
  DayOfRest: "DayOfRest",
  DayOfWork: "DayOfWork",
} as const;

const validator = withZod(
  z.object({
    name: z.string().min(1, "Beskrivning måste anges"),
    type: z.nativeEnum(GoalType),
    typeDayOfRestNumberOfDays: z.coerce.number().optional(),
    typeDayOfWorkNumberOfDays: z.coerce.number().optional(),
    typePerformExerciseTypeExerciseTypeId: z.string().optional(),
    typePerformExerciseTypeNumberOfDays: z.coerce.number().optional(),
  })
);

export async function action({ request }: ActionFunctionArgs) {
  const url = new URL(request.url);
  const { id: userId } = await authenticator.isAuthenticated(request, {
    failureRedirect: "/",
  });
  const data = await validate({ request, validator });

  await db.goal.create({
    data: {
      userId,
      name: data.name,
      type: data.type,
      typeDayOfRestNumberOfDays: data.typeDayOfRestNumberOfDays ?? undefined,
      typeDayOfWorkNumberOfDays: data.typeDayOfWorkNumberOfDays ?? undefined,
      typePerformExerciseTypeNumberOfDays:
        data.typePerformExerciseTypeNumberOfDays ?? undefined,
      typePerformExerciseTypeExerciseTypeId:
        data.typePerformExerciseTypeExerciseTypeId ?? undefined,
      timeType: GoalTimeType.EveryRollingNumberOfDays,
      timeTypeEveryRollingNumberOfDaysAmount: 7,
    },
  });

  return redirect(url.searchParams.get("redirectTo") ?? "/");
}

export async function loader({ request, params }: LoaderFunctionArgs) {
  const res = await gql({
    document: GoalDetailsDocument,
    variables: { goalId: params.goalId! },
    request,
  });
  const goal = res.data?.goal;
  if (!goal) {
    throw new Response("Goal not found", { status: 404 });
  }
  return { goal, timeZone: res.data?.timeZone };
}

export default function CreateTest() {
  const { goal, timeZone } = useLoaderData<typeof loader>();

  return (
    <div className="flex flex-col gap-3 py-6 container max-w-screen-md mx-auto px-4">
      <TitleRow
        actions={
          <IconButtonLink to={`/goals/${goal.id}/edit`} aria-label="Ändra">
            <FontAwesomeIcon icon={faCog} />
          </IconButtonLink>
        }
      >
        <H1>{goal?.title}</H1>
      </TitleRow>
      {typeof goal.currentProgress === "number" ? (
        <Progress
          value={goal.currentProgress * 100}
          className="h-3"
          indicatorClassName={
            goal.currentProgress >= 1 ? "bg-green-600" : "bg-yellow-600"
          }
        />
      ) : null}

      <div>
        <div>
          <span className="font-bold">Nuvarande period:</span>{" "}
          {DateTime.fromISO(goal.currentPeriodStart)
            .setZone(timeZone)
            .toFormat("yyyy-MM-dd")}{" "}
          till{" "}
          {DateTime.fromISO(goal.currentPeriodEnd)
            .setZone(timeZone)
            .toFormat("yyyy-MM-dd")}
        </div>

        {goal.__typename === "GoalDayOfRest" ? (
          <div>
            <span className="font-bold">Antal vilodagar hittills:</span>{" "}
            {goal.currentDaysOfRest}
            <br />
            <span className="font-bold">Mål:</span> minst{" "}
            {goal.targetDaysOfRest}{" "}
            {goal.targetDaysOfRest === 1 ? "dag" : "dagar"}
          </div>
        ) : null}

        {goal.__typename === "GoalDayOfWork" ? (
          <div>
            <span className="font-bold">Antal träningsdagar hittills:</span>{" "}
            {goal.currentDaysOfWork}
            <br />
            <span className="font-bold">Mål:</span> minst{" "}
            {goal.targetDaysOfWork}{" "}
            {goal.targetDaysOfWork === 1 ? "dag" : "dagar"}
          </div>
        ) : null}

        {goal.__typename === "GoalPerformExerciseType" ? (
          <div>
            <span className="font-bold">Antal dagar hittills:</span>{" "}
            {goal.currentDayCount}
            <br />
            <span className="font-bold">Mål:</span> minst {goal.targetDayCount}{" "}
            {goal.targetDayCount === 1 ? "dag" : "dagar"}
          </div>
        ) : null}
      </div>
    </div>
  );
}
