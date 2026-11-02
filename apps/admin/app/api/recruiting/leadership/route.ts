import { RaftResponse } from "@uw-datasci/raft";
import { leadershipService } from "@uwdsc/admin";
import { requireLeadership, withRecruiting } from "@/guards/withRecruiting";
import { updateLeadershipSchema } from "@/lib/schemas/recruiting";

/**
 * GET /api/recruiting/leadership
 * The roster, current leaders and hiring picks for the current cycle (presidents).
 */
export const GET = withRecruiting(async (_request, _context, _user, recruiting) => {
  const view = await leadershipService.getLeadership(recruiting.cycle!);
  return RaftResponse.ok(view);
}, requireLeadership);

/**
 * PUT /api/recruiting/leadership
 * Apply roster edits after the lock; role changes take effect immediately.
 */
export const PUT = withRecruiting(async (request, _context, user, recruiting) => {
  const parsed = updateLeadershipSchema.safeParse(await request.json());
  if (!parsed.success) {
    return RaftResponse.badRequest(
      parsed.error.issues[0]?.message || "Invalid data",
      "Validation error"
    );
  }

  const cycle = recruiting.cycle!;
  await leadershipService.update(cycle, user.id, parsed.data.draft);
  return RaftResponse.ok(await leadershipService.getLeadership(cycle));
}, requireLeadership);
