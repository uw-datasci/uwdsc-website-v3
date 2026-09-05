import { type ReturningExecSubmissionData } from "@uwdsc/common/types";
import { RaftResponse } from "@uw-datasci/raft";
import { returningExecService } from "@uwdsc/admin";
import { withAuth } from "@/guards/withAuth";

/**
 * GET /api/returning-execs/me
 * Returns the current user's returning-exec submission for the active term, or null.
 */
export const GET = withAuth(
  async (_request, _context, user) => {
    const submission = await returningExecService.getOwnSubmission(user.id);
    return RaftResponse.ok({ submission });
  },
  { allowAlum: true }
);

/**
 * PUT /api/returning-execs/me
 * Upsert the current user's returning-exec submission for the active term.
 */
export const PUT = withAuth(
  async (request, _context, user) => {
    const body = (await request.json()) as ReturningExecSubmissionData;
    const submission = await returningExecService.upsertSubmission(user.id, body);
    return RaftResponse.ok({ submission });
  },
  { allowAlum: true }
);
