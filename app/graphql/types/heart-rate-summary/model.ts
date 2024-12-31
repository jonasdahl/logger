import type { DateTime } from "luxon";

export type HeartRateSummaryModel = {
  start: DateTime;
  end: DateTime;
  samples: {
    value: number | null;
    durationSeconds: number;
    tStart: DateTime;
  }[];
};
