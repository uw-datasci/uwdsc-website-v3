import { RaftResponse } from "@uw-datasci/raft";
import { withRecruiting } from "@/guards/withRecruiting";

/**
 * GET /api/recruiting/context
 * The viewer's Recruiting capabilities for the current hiring cycle.
 */
export const GET = withRecruiting(async (_request, _context, _user, recruiting) => {
  return RaftResponse.ok(recruiting);
});
