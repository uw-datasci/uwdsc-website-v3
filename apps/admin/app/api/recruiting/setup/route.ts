import { RaftResponse } from "@uw-datasci/raft";
import { setupService } from "@uwdsc/admin";
import { requireSetup, withRecruiting } from "@/guards/withRecruiting";

/**
 * GET /api/recruiting/setup
 * Schedule, cycle positions and the question bank.
 */
export const GET = withRecruiting(async (_request, _context, _user, recruiting) => {
  return RaftResponse.ok(await setupService.getSetup(recruiting));
}, requireSetup);
