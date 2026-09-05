import { RaftResponse } from "@uw-datasci/raft";
import { applicationService } from "@uwdsc/admin";
import type { WithAuthContext } from "@/guards/withAuth";
import { withPresAccess } from "@/guards/withPresAccess";

interface Params extends WithAuthContext {
  params: Promise<{ id: string }>;
}

/**
 * DELETE /api/applications/positions/[id]
 * Close a position for applications (soft-closes its
 * application_positions_available row -- the row, existing selections, and
 * its question assignments are kept; the role just stops appearing as an
 * option for new applicants). President only.
 */
export const DELETE = withPresAccess<Params>(async (_request, { params }) => {
  const { id } = await params;
  const availableId = Number(id);
  if (!Number.isInteger(availableId) || availableId <= 0) {
    return RaftResponse.badRequest("Invalid position identifier");
  }

  await applicationService.closeAvailablePosition(availableId);
  return RaftResponse.ok({ success: true });
});
