import type { DateTime } from "luxon";

export type HeartRateSummaryModel = {
  samples: {
    value: number | null;
    durationSeconds: number;
    tStart: DateTime;
  }[];
};
