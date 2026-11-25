import { RaftResponse } from "@uw-datasci/raft";
import { recruitingService } from "@uwdsc/admin";
import { withRecruiting } from "@/guards/withRecruiting";

/**
 * GET /api/recruiting/cycle/terms
 * Terms a new hiring cycle can target (those starting after the active term).
 */
export const GET = withRecruiting(
  async () => {
    const terms = await recruitingService.getStartableTerms();
    return RaftResponse.ok({ terms });
  },
  {
    require: (caps) => (caps.can.startCycle ? null : "Only presidents can start a cycle"),
  }
);
