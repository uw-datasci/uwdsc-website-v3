import { onboardingService } from "@uwdsc/admin";
import { isDateWindowOpen } from "@uwdsc/common/utils";

/**
 * While the active term's exec onboarding window is open, execs may use the admin app
 * without a paid membership (e.g. to complete logistics onboarding before paying).
 */
export async function graceDuringOnboarding(): Promise<boolean> {
  const term = await onboardingService.getActiveTerm();
  return isDateWindowOpen(term?.start_date, term?.onboarding_due_date);
}
