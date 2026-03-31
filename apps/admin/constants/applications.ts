import type { ApplicationReviewStatus } from "@uwdsc/common/types";

export const VP_REVIEW_STATUS_LIST: readonly ApplicationReviewStatus[] = [
  "In Review",
  "Interviewing",
  "Wanted",
  "Not Wanted",
];

export const PRESIDENT_REVIEW_ONLY_STATUS_LIST: readonly ApplicationReviewStatus[] =
  ["Offer Sent", "Accepted Offer", "Declined Offer", "Rejection Sent"];

export const REVIEW_STATUS_LIST: readonly ApplicationReviewStatus[] = [
  ...VP_REVIEW_STATUS_LIST,
  ...PRESIDENT_REVIEW_ONLY_STATUS_LIST,
];

export const VP_REVIEW_STATUS_SET = new Set<ApplicationReviewStatus>(
  VP_REVIEW_STATUS_LIST,
);

export const PRESIDENT_REVIEW_STATUS_SET = new Set<ApplicationReviewStatus>(
  REVIEW_STATUS_LIST,
);

export const REVIEW_STATUS_SET = PRESIDENT_REVIEW_STATUS_SET;

export const ALL_STATUS_FILTER = "all" as const;

export type ApplicationReviewStatusFilter =
  | ApplicationReviewStatus
  | typeof ALL_STATUS_FILTER;
