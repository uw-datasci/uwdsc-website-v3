import { RaftResponse } from "@uw-datasci/raft";
import { withAuth } from "@/guards/withAuth";
import { onboardingService } from "@uwdsc/admin";

export const GET = withAuth(async () => {
  const data = await onboardingService.getActiveTerm();
  return RaftResponse.ok(data);
});
