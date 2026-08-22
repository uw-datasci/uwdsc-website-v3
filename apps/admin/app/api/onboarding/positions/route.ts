import { RaftResponse } from "@uw-datasci/raft";
import { onboardingService } from "@uwdsc/admin";
import { withAuth } from "@/guards/withAuth";

export const GET = withAuth(async () => {
  const data = await onboardingService.getExecPositions();
  return RaftResponse.ok(data);
});
