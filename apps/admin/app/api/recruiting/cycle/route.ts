import { RaftResponse } from "@uw-datasci/raft";
import { recruitingService } from "@uwdsc/admin";
import { withRecruiting } from "@/guards/withRecruiting";
import { startCycleSchema } from "@/lib/schemas/recruiting";

/**
 * POST /api/recruiting/cycle
 * Start the hiring cycle for the active term (presidents, when no cycle exists yet).
 */
export const POST = withRecruiting(
  async (request, _context, user) => {
    const parsed = startCycleSchema.safeParse(await request.json());
    if (!parsed.success) {
      return RaftResponse.badRequest(
        parsed.error.issues[0]?.message || "Invalid data",
        "Validation error"
      );
    }

    const cycle = await recruitingService.startCycle(user.id, parsed.data.targetTermId);
    return RaftResponse.ok(cycle);
  },
  {
    require: (caps) =>
      caps.can.startCycle ? null : "Only presidents can start a cycle, and only when none exists",
  }
);
