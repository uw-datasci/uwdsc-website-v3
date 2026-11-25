import { RaftResponse } from "@uw-datasci/raft";
import { leadershipService } from "@uwdsc/admin";
import { requireLeadership, withRecruiting } from "@/guards/withRecruiting";
import { saveLeadershipSchema } from "@/lib/schemas/recruiting";

/**
 * POST /api/recruiting/leadership/lock
 * Lock next term's leadership. Grants and removes roles in one transaction.
 */
export const POST = withRecruiting(async (request, _context, user, recruiting) => {
  const parsed = saveLeadershipSchema.safeParse(await request.json());
  if (!parsed.success) {
    return RaftResponse.badRequest(
      parsed.error.issues[0]?.message || "Invalid data",
      "Validation error"
    );
  }

  await leadershipService.lock(
    recruiting.cycle!,
    user.id,
    parsed.data.draft,
    parsed.data.hiring
  );
  return RaftResponse.ok({ locked: true });
}, requireLeadership);
