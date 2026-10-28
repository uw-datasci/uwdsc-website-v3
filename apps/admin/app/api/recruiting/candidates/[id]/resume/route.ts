import { RaftResponse } from "@uw-datasci/raft";
import { candidateService } from "@uwdsc/admin";
import { requireBoard, withRecruiting } from "@/guards/withRecruiting";
import type { WithAuthContext } from "@/guards/withAuth";
import { recruitingIdSchema } from "@/lib/schemas/recruiting";
import { createResumeService } from "@/lib/services";

interface Params extends WithAuthContext {
  params: Promise<{ id: string }>;
}

/**
 * GET /api/recruiting/candidates/:applicationId/resume
 * A short-lived signed URL for the candidate's resume, or null if they have none.
 */
export const GET = withRecruiting<Params>(async (_request, { params }, _user, recruiting) => {
  const { id } = await params;
  if (!recruitingIdSchema.safeParse(id).success) {
    return RaftResponse.badRequest("Invalid application id");
  }
  const profileId = await candidateService.getResumeOwner(recruiting, id);
  const resumeService = await createResumeService();
  return RaftResponse.ok({ url: await resumeService.getResumeUrl(profileId) });
}, requireBoard);
