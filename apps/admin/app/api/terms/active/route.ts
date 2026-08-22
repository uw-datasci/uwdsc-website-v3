import { RaftResponse } from "@uw-datasci/raft";
import { applicationService as adminApplicationService } from "@uwdsc/admin";
import { applicationService as coreApplicationService } from "@uwdsc/core";
import { withAuth } from "@/guards/withAuth";
import { withPresAccess } from "@/guards/withPresAccess";
import { termScheduleSchema } from "@/lib/schemas/termSchedule";

/**
 * GET /api/terms/active
 * Get the active term, if any. Admin/exec only.
 */
export const GET = withAuth(async () => {
  const term = await coreApplicationService.getActiveTerm();
  return RaftResponse.ok({ term });
});

/**
 * PATCH /api/terms/active
 * Update the active term's application schedule (release date, soft
 * deadline, hard deadline). President only.
 */
export const PATCH = withPresAccess(async (request) => {
  const body = await request.json();
  const parsed = termScheduleSchema.safeParse(body);
  if (!parsed.success) {
    return RaftResponse.badRequest(
      parsed.error.issues[0]?.message ?? "Invalid schedule payload"
    );
  }

  const term = await adminApplicationService.updateActiveTermSchedule(parsed.data);
  return RaftResponse.ok({ success: true, term });
});
