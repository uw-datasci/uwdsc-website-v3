import { RaftResponse } from "@uw-datasci/raft";
import { leadershipService } from "@uwdsc/admin";
import { requireLeadership, withRecruiting } from "@/guards/withRecruiting";
import { saveLeadershipSchema } from "@/lib/schemas/recruiting";

/**
 * PUT /api/recruiting/leadership/draft
 * Save the roster and hiring picks without locking.
 */
export const PUT = withRecruiting(async (request, _context, _user, recruiting) => {
  const parsed = saveLeadershipSchema.safeParse(await request.json());
  if (!parsed.success) {
    return RaftResponse.badRequest(
      parsed.error.issues[0]?.message || "Invalid data",
      "Validation error"
    );
  }

  const view = await leadershipService.saveDraft(
    recruiting.cycle!,
    parsed.data.draft,
    parsed.data.hiring
  );
  return RaftResponse.ok(view);
}, requireLeadership);
