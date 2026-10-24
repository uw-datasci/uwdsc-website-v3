import { RaftResponse } from "@uw-datasci/raft";
import { candidateService } from "@uwdsc/admin";
import { requireBoard, withRecruiting } from "@/guards/withRecruiting";
import type { WithAuthContext } from "@/guards/withAuth";
import { recruitingIdSchema } from "@/lib/schemas/recruiting";

interface Params extends WithAuthContext {
  params: Promise<{ id: string }>;
}

/**
 * GET /api/recruiting/candidates/:applicationId
 * The full application: header, past exec roles and answers by section.
 */
export const GET = withRecruiting<Params>(async (_request, { params }, _user, recruiting) => {
  const { id } = await params;
  if (!recruitingIdSchema.safeParse(id).success) {
    return RaftResponse.badRequest("Invalid application id");
  }
  return RaftResponse.ok(await candidateService.getCandidate(recruiting, id));
}, requireBoard);
