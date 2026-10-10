import { RaftResponse } from "@uw-datasci/raft";
import { contactSubmissionService } from "@uwdsc/admin";
import { withAdmin } from "@/guards/withAdmin";
import type { WithAuthContext } from "@/guards/withAuth";
import { resolveSubmissionSchema } from "@/lib/schemas/supportSubmission";

interface Params extends WithAuthContext {
  params: Promise<{ id: string }>;
}

/**
 * POST /api/support/submissions/[id]/resolve
 * Mark a support submission resolved or reopen it. Admin / pres only.
 */
export const POST = withAdmin<Params>(async (request, { params }, user) => {
  const { id } = await params;
  const body = await request.json();

  const parsed = resolveSubmissionSchema.safeParse(body);
  if (!parsed.success) {
    return RaftResponse.badRequest(
      parsed.error.issues[0]?.message ?? "Invalid data",
      "Validation error"
    );
  }

  await contactSubmissionService.setResolved(id, parsed.data.resolved ? user.id : null);

  return RaftResponse.ok({ success: true });
});
