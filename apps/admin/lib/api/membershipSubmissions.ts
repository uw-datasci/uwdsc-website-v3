/**
 * Membership Submission API Functions
 *
 * Online proof-of-payment review queue.
 */

import type {
  ReviewSubmissionData,
  ReviewSubmissionResult,
  SubmissionReviewItem,
  SubmissionStatus,
} from "@uwdsc/common/types";
import { createApiError } from "./error";
import { parseJsonResponse } from "./parse-response";

export async function getMembershipSubmissions(options?: {
  status?: SubmissionStatus;
  termId?: string;
}): Promise<SubmissionReviewItem[]> {
  const params = new URLSearchParams();
  if (options?.status) params.append("status", options.status);
  if (options?.termId) params.append("termId", options.termId);

  const queryString = params.toString();
  const url = queryString
    ? `/api/membership/submissions?${queryString}`
    : "/api/membership/submissions";

  const response = await fetch(url);
  const data = await parseJsonResponse<{ submissions: SubmissionReviewItem[] }>(response);

  if (!response.ok) throw createApiError(data, response.status);

  return data.submissions;
}

export async function reviewMembershipSubmission(
  submissionId: string,
  payload: ReviewSubmissionData
): Promise<ReviewSubmissionResult> {
  const response = await fetch(`/api/membership/submissions/${submissionId}/review`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await parseJsonResponse<ReviewSubmissionResult>(response);

  if (!response.ok) throw createApiError(data, response.status);

  return data;
}
