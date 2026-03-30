/**
 * Campaigns API Functions
 *
 * This file contains all email campaign-related API calls.
 * Components should use these functions instead of making direct fetch calls.
 */

import type { SendCampaignFormValues } from "@/lib/schemas/campaign";
import { createApiError } from "./error";

/**
 * Send an email campaign
 *
 * @param data - Campaign payload: subject, recipients, and markdown body
 * @returns Promise with the Resend message id
 * @throws Error if request fails or unauthorized
 */
export async function sendCampaign(
  data: SendCampaignFormValues,
): Promise<{ id: string }> {
  const response = await fetch("/api/campaigns/send", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok) throw createApiError(result, response.status);

  return result;
}
