/**
 * Emails API Functions
 *
 * This file contains all email-related API calls.
 * Components should use these functions instead of making direct fetch calls.
 */

import type { SendCampaignFormValues } from "@/lib/schemas/emails";
import { createApiError } from "./error";

/**
 * Send an email blast
 *
 * @param data - Email payload: subject, recipient role audiences, and markdown body
 * @returns Promise with the Resend message id
 * @throws Error if request fails or unauthorized
 */
export async function sendCampaign(
  data: SendCampaignFormValues,
): Promise<{ id: string }> {
  const response = await fetch("/api/emails/campaigns", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok) throw createApiError(result, response.status);

  return result;
}
