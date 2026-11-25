import { RaftResponse } from "@uw-datasci/raft";
import { notesService } from "@uwdsc/admin";
import { requireBoard, withRecruiting } from "@/guards/withRecruiting";
import type { WithAuthContext } from "@/guards/withAuth";
import { recruitingIdSchema } from "@/lib/schemas/recruiting";

interface Params extends WithAuthContext {
  params: Promise<{ id: string }>;
}

/**
 * GET /api/recruiting/candidates/:applicationId/activity
 * Status moves, notes and the application, newest first.
 */
export const GET = withRecruiting<Params>(async (_request, { params }, _user, recruiting) => {
  const { id } = await params;
  if (!recruitingIdSchema.safeParse(id).success) {
    return RaftResponse.badRequest("Invalid application id");
  }
  return RaftResponse.ok({ activity: await notesService.getActivity(recruiting, id) });
}, requireBoard);
