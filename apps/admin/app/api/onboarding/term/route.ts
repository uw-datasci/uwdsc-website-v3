import { RaftResponse } from "@uw-datasci/raft";
import { withAuth } from "@/guards/withAuth";
import { onboardingService } from "@uwdsc/admin";

// allowAlum: the returning-exec form (/logistics/returning) checks the active term's
// submission window before rendering, and alum users must be able to reach that check.
export const GET = withAuth(
  async () => {
    const data = await onboardingService.getActiveTerm();
    return RaftResponse.ok(data);
  },
  { allowAlum: true }
);
