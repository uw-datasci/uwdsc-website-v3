import { type ApplicationReviewStatus } from "@uwdsc/common/types";
import { RaftResponse } from "@uw-datasci/raft";
import { hiringService } from "@uwdsc/admin";
import { withPresAccess } from "@/guards/withPresAccess";

interface ParamsContext {
  params: Promise<{ id: string }>;
}

/**
 * PATCH /api/applications/hiring/selections/[id]
 * Update a single position selection's review status (president-only statuses).
 * Returning-exec submissions are no longer editable (the returning-exec flow was removed).
 */
export const PATCH = withPresAccess<ParamsContext>(
  async (request, { params }) => {
    const { id } = await params;
    const body = (await request.json()) as {
      status?: ApplicationReviewStatus;
      source?: "application" | "returning_exec";
    };

    if (!body.status) {
      return RaftResponse.badRequest("Status is required");
    }

    if (body.source === "returning_exec") {
      return RaftResponse.badRequest("Returning-exec submissions can no longer be updated");
    }

    await hiringService.updateSelectionStatus(id, body.status);

    return RaftResponse.ok({ success: true });
  }
);
