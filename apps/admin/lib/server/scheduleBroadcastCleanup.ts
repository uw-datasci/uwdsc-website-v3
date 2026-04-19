import { emailService } from "@uwdsc/admin";
import { after } from "next/server";

/**
 * After any Resend marketing broadcast that temporarily adds recipients to the
 * scratch campaign segment, schedule removal once Resend has resolved delivery.
 *
 * Call this with `recipientEmails` from any `emailService` segment broadcast (e.g.
 * `sendCampaignEmail`, `sendNewExecWelcomeBroadcast`) after a successful send from an admin route.
 */
export function scheduleBroadcastCleanup(
  recipientEmails: string[],
): void {
  if (recipientEmails.length === 0) return;

  after(async () => {
    const delayMs = emailService.campaignSegmentCleanupDelayMs;
    if (delayMs > 0) await new Promise((r) => setTimeout(r, delayMs));
    await emailService.removeRecipientsFromSegment([...recipientEmails]);
  });
}
