import { RaftResponse } from "@uw-datasci/raft";
import { scheduleSchema } from "@uwdsc/common/schemas";
import { setupService } from "@uwdsc/admin";
import { requireSetup, withRecruiting } from "@/guards/withRecruiting";

/**
 * PUT /api/recruiting/setup/schedule
 * Application dates, target term and offer window (presidents).
 */
export const PUT = withRecruiting(async (request, _context, _user, recruiting) => {
  const parsed = scheduleSchema.safeParse(await request.json());
  if (!parsed.success)
    return RaftResponse.badRequest(
      parsed.error.issues[0]?.message || "Invalid data",
      "Validation error"
    );

  await setupService.updateSchedule(recruiting, parsed.data);
  return RaftResponse.ok({ saved: true });
}, requireSetup);
