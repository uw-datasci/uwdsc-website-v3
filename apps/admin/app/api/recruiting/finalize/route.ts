import { RaftResponse } from "@uw-datasci/raft";
import { finalizeSchema } from "@uwdsc/common/schemas";
import { finalizeService } from "@uwdsc/admin";
import { requireFinalize, withRecruiting } from "@/guards/withRecruiting";
import { scheduleBroadcastCleanup } from "@/lib/server/scheduleBroadcastCleanup";

/**
 * GET /api/recruiting/finalize
 * Who joins, stays and leaves, the team page preview, and what blocks finalizing.
 */
export const GET = withRecruiting(async (_request, _context, _user, recruiting) => {
  return RaftResponse.ok(await finalizeService.getFinalize(recruiting));
}, requireFinalize);

/**
 * POST /api/recruiting/finalize
 * Apply roles, write next term's team and close open offers, then send the welcome email.
 */
export const POST = withRecruiting(async (request, _context, user, recruiting) => {
  const parsed = finalizeSchema.safeParse(await request.json());
  if (!parsed.success)
    return RaftResponse.badRequest(
      parsed.error.issues[0]?.message || "Invalid data",
      "Validation error"
    );

  const { result, broadcastRecipients } = await finalizeService.finalize(
    recruiting,
    user.id,
    parsed.data
  );
  scheduleBroadcastCleanup(broadcastRecipients);
  return RaftResponse.ok(result);
}, requireFinalize);
