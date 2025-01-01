import type { LoaderFunctionArgs } from "@remix-run/node";
import { authenticator } from "~/.server/auth.server";

import { useLoaderData } from "@remix-run/react";
import { useMemo } from "react";
import { chunk } from "remeda";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Container } from "~/components/ui/container";
import { ExerciseDetailsDocument } from "~/graphql/generated/documents";
import { gqlData } from "~/graphql/graphql.server";

export async function loader({ request, params }: LoaderFunctionArgs) {
  await authenticator.isAuthenticated(request, { failureRedirect: "/" });
  const { exerciseId } = z.object({ exerciseId: z.string() }).parse(params);
  return gqlData({
    document: ExerciseDetailsDocument,
    request,
    variables: { exerciseId },
  });
}

type CollectionEntry<T> = GroupEntry<T> | ItemEntry<T>;
type GroupEntry<T> = { type: "group"; items: T[] };
type ItemEntry<T> = { type: "item"; item: T };
type Collection<T> = CollectionEntry<T>[];

function getWindows<T>(items: T[], windowSize: number): T[][] {
  return chunk(items, windowSize);
}

function isGroupablePattern<TItem>(
  list: ItemEntry<TItem>[],
  isGroupEqual: (a: TItem[], b: TItem[]) => boolean
) {
  for (let windowSize = list.length; windowSize >= 1; windowSize--) {
    if (list.length % windowSize !== 0) {
      continue;
    }
    const windows = getWindows(list, windowSize);
    if (windows.length === 1) {
      continue;
    }
    const firstWindow = windows[0]!;
    if (
      windows.every(
        (window) =>
          window.length === firstWindow.length &&
          isGroupEqual(
            firstWindow.map((i) => i.item),
            window.map((i) => i.item)
          )
      )
    ) {
      return true;
    }
  }
  return false;
}

function isAllEqual<TItem>(
  list: ItemEntry<TItem>[],
  isGroupEqual: (a: TItem[], b: TItem[]) => boolean
) {
  return list.every((item) => isGroupEqual([item.item], [list[0]!.item]));
}

function groupSimilarOnce<TItem>(
  collection: Collection<TItem>,
  isGroupEqual: (a: TItem[], b: TItem[]) => boolean
) {
  for (let windowSize = collection.length; windowSize >= 2; windowSize--) {
    for (
      let windowOffset = 0;
      windowOffset <= collection.length - windowSize;
      windowOffset++
    ) {
      const window = collection.slice(windowOffset, windowOffset + windowSize);
      if (window.length !== windowSize) {
        continue;
      }
      if (window.some((entry) => entry.type !== "item")) {
        continue;
      }
      const itemWindow = window.map((entry) => entry as ItemEntry<TItem>);
      if (isAllEqual(itemWindow, isGroupEqual)) {
        return [
          ...collection.slice(0, windowOffset),
          { type: "group" as const, items: itemWindow.map((i) => i.item) },
          ...collection.slice(windowOffset + windowSize),
        ];
      }
    }
  }

  console.log("second pass", collection);
  for (let windowSize = collection.length; windowSize >= 2; windowSize--) {
    for (
      let windowOffset = 0;
      windowOffset <= collection.length - windowSize;
      windowOffset++
    ) {
      const window = collection.slice(windowOffset, windowOffset + windowSize);
      if (window.length !== windowSize) {
        continue;
      }
      if (window.some((entry) => entry.type !== "item")) {
        continue;
      }
      const itemWindow = window.map((entry) => entry as ItemEntry<TItem>);
      if (isGroupablePattern(itemWindow, isGroupEqual)) {
        return [
          ...collection.slice(0, windowOffset),
          { type: "group" as const, items: itemWindow.map((i) => i.item) },
          ...collection.slice(windowOffset + windowSize),
        ];
      }
    }
  }

  return collection;
}

function groupSimilar<TItem>(
  collection: Collection<TItem>,
  isGroupEqual: (a: TItem[], b: TItem[]) => boolean
) {
  let improvedCollection = collection;
  for (let i = 0; i < 10000; i++) {
    const previousCollection = improvedCollection;
    improvedCollection = groupSimilarOnce(previousCollection, isGroupEqual);
    if (improvedCollection.length >= previousCollection.length) {
      break;
    }
  }
  return improvedCollection;
}

function initCollection<T>(items: T[]): Collection<T> {
  return items.map((item) => ({ type: "item", item }));
}

export default function Activity() {
  const data = useLoaderData<typeof loader>();
  const items = useMemo(() => {
    return (
      data.exercise?.items.edges.flatMap((edge) =>
        edge.node ? [edge.node] : []
      ) || []
    );
  }, [data.exercise?.items.edges]);

  const itemGroups = useMemo(() => {
    return groupSimilar(initCollection(items), (itemsA, itemsB) => {
      return (
        itemsA.length === itemsB.length &&
        itemsA.every(
          (itemA, index) =>
            itemA.exerciseType.id === itemsB[index]?.exerciseType.id
        )
      );
    });
  }, [items]);

  return (
    <Container className="pb-0 flex flex-col gap-3">
      {itemGroups.map((item, i) => {
        if (item.type === "group") {
          const isOneExerciseType = item.items.every(
            ({ exerciseType }) =>
              exerciseType.name === item.items[0]?.exerciseType.name
          );
          const title = isOneExerciseType
            ? item.items[0]?.exerciseType.name
            : "Flera övningar";

          return (
            <Card key={i}>
              <CardHeader>
                <CardTitle>{title}</CardTitle>
              </CardHeader>
              <CardContent>
                {item.items
                  .flatMap((x) =>
                    x.amount.map((amount) => ({ ...amount, ...x }))
                  )
                  .map((item) => {
                    return (
                      <div key={item.id}>
                        {item.duration.__typename ===
                        "ExerciseDurationRepetitions"
                          ? `${item.duration.repetitions}x ${
                              isOneExerciseType ? "" : item.exerciseType.name
                            }`
                          : item.duration.__typename === "ExerciseDurationTime"
                          ? `${item.duration.durationSeconds} sekunder ${
                              isOneExerciseType ? "" : item.exerciseType.name
                            }`
                          : `${
                              isOneExerciseType
                                ? "Nivå"
                                : `${item.exerciseType.name} till nivå`
                            }: ${item.duration.levelType.name}`}
                        {item.loads
                          .map((l) => l.value + (l.unit || ""))
                          .join(", ")}
                      </div>
                    );
                  })}
              </CardContent>
            </Card>
          );
        }

        return (
          <Card key={item.item.id}>
            <CardHeader>
              <CardTitle>{item.item.exerciseType.name}</CardTitle>
            </CardHeader>
          </Card>
        );
      })}
    </Container>
  );
}
