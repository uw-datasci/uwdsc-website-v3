import { RaftResponse } from "@uw-datasci/raft";
import { hiringService } from "@uwdsc/admin";
import { scheduleBroadcastCleanup } from "@/lib/server/scheduleBroadcastCleanup";
import { withPresAccess } from "@/guards/withPresAccess";

/**
 * POST /api/applications/hiring/finalize
 * Finalize user roles for the new term based on accepted offers.
 */
export const POST = withPresAccess(async (request) => {
  const body = (await request.json().catch(() => null)) as unknown;
  const when2MeetLink =
    typeof body === "object" &&
    body !== null &&
    "when2MeetLink" in body &&
    typeof (body as { when2MeetLink: unknown }).when2MeetLink === "string"
      ? (body as { when2MeetLink: string }).when2MeetLink
      : "";

  const summary = await hiringService.finalizeRoles({ when2MeetLink });
  const welcome = summary.exec_welcome_broadcast;
  if (welcome?.recipient_emails.length) scheduleBroadcastCleanup(welcome.recipient_emails);

  return RaftResponse.ok({ summary });
});
