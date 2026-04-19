import type { ApplicationReviewStatus } from "@uwdsc/common/types";

export const VP_REVIEW_STATUS_LIST: readonly ApplicationReviewStatus[] = [
  "In Review",
  "Interviewing",
  "Wanted",
  "Not Wanted",
];

export const PRESIDENT_REVIEW_STATUS_LIST: readonly ApplicationReviewStatus[] = [
  "Offer Sent",
  "Accepted Offer",
  "Declined Offer",
  "Rejection Sent",
];

export const REVIEW_STATUS_LIST: readonly ApplicationReviewStatus[] = [
  ...VP_REVIEW_STATUS_LIST,
  ...PRESIDENT_REVIEW_STATUS_LIST,
];

export const VP_REVIEW_STATUS_SET = new Set<ApplicationReviewStatus>(VP_REVIEW_STATUS_LIST);

export const PRESIDENT_REVIEW_STATUS_SET = new Set<ApplicationReviewStatus>(REVIEW_STATUS_LIST);

export const REVIEW_STATUS_SET = PRESIDENT_REVIEW_STATUS_SET;

export const ALL_STATUS_FILTER = "all" as const;

export type ApplicationReviewStatusFilter = ApplicationReviewStatus | typeof ALL_STATUS_FILTER;

// --- Hiring: president row actions (menu order + labels + confirm dialog copy) ---

export const HIRING_ROW_ACTION_ORDER = [
  "Offer Sent",
  "Rejection Sent",
  "Accepted Offer",
  "Declined Offer",
] as const satisfies readonly ApplicationReviewStatus[];

export type HiringRowActionStatus = (typeof HIRING_ROW_ACTION_ORDER)[number];

/** Which president row actions appear for a selection, based on its current review status. */
export function getHiringStatusOptions(
  status: ApplicationReviewStatus,
): HiringRowActionStatus[] {
  switch (status) {
    case "Wanted":
      return ["Offer Sent", "Rejection Sent"];
    case "Not Wanted":
      return ["Rejection Sent"];
    case "Offer Sent":
      return ["Accepted Offer", "Declined Offer"];
    case "Accepted Offer":
      return ["Declined Offer"];
    case "Declined Offer":
      return ["Accepted Offer"];
    default:
      return [];
  }
}

export const HIRING_ROW_ACTION_MENU_LABEL: Record<HiringRowActionStatus, string> = {
  "Offer Sent": "Send offer",
  "Rejection Sent": "Send rejection",
  "Accepted Offer": "Update to accepted offer",
  "Declined Offer": "Update to declined offer",
};

export const HIRING_ROW_ACTION_CONFIRM_COPY: Record<
  HiringRowActionStatus,
  {
    readonly title: string;
    readonly description: string;
    readonly confirmLabel: string;
    readonly destructive: boolean;
  }
> = {
  "Offer Sent": {
    title: "Send offer?",
    description:
      "This will record that an offer was sent to this applicant for the selected role.",
    confirmLabel: "Send offer",
    destructive: false,
  },
  "Rejection Sent": {
    title: "Send rejection?",
    description:
      "This will record that a rejection was communicated for this applicant and role.",
    confirmLabel: "Send rejection",
    destructive: true,
  },
  "Accepted Offer": {
    title: "Mark as accepted offer?",
    description: "This updates the applicant's status for this role to accepted offer.",
    confirmLabel: "Mark accepted",
    destructive: false,
  },
  "Declined Offer": {
    title: "Mark as declined offer?",
    description: "This updates the applicant's status for this role to declined offer.",
    confirmLabel: "Mark declined",
    destructive: true,
  },
};

export const HIRING_ROW_ACTION_CANCEL_LABEL = "Cancel";

export const HIRING_ROW_ACTION_WORKING_LABEL = "Working…";

export const HIRING_ROW_ACTION_DROPDOWN_CONTENT_CLASS = "w-64";
