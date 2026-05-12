import { onboardingService } from "@uwdsc/admin";
import { isOnboardingWindowOpen } from "@uwdsc/common/utils";

/**
 * While the active term's exec onboarding window is open, execs may use the admin app
 * without a paid membership (e.g. to complete logistics onboarding before paying).
 */
export async function graceDuringOnboarding(): Promise<boolean> {
  const term = await onboardingService.getActiveTerm();
  return isOnboardingWindowOpen(term);
}
