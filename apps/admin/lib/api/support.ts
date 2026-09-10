/**
 * Support Inbox API Functions
 *
 * Contact-form and support-email submissions.
 */

import type { ContactSubmissionItem } from "@uwdsc/common/types";
import { createApiError } from "./error";
import { parseJsonResponse } from "./parse-response";

export async function getSupportSubmissions(): Promise<ContactSubmissionItem[]> {
  const response = await fetch("/api/support/submissions");
  const data = await parseJsonResponse<{ submissions: ContactSubmissionItem[] }>(response);

  if (!response.ok) throw createApiError(data, response.status);

  return data.submissions;
}

export async function resolveSupportSubmission(id: string, resolved: boolean): Promise<void> {
  const response = await fetch(`/api/support/submissions/${id}/resolve`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ resolved }),
  });
  const data = await parseJsonResponse<{ success: boolean }>(response);

  if (!response.ok) throw createApiError(data, response.status);
}
