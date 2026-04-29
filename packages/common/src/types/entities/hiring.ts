import type { ApplicationReviewStatus, UserRole } from "../shared/enums";

/** A position selection enriched with VP/subteam info for the hiring dashboard */
export interface HiringPositionSelection {
  id: string;
  application_id: string;
  position_id: string;
  priority: number;
  status: ApplicationReviewStatus;
  position_name: string;
  is_vp: boolean;
  subteam_name: string | null;
}

/** An applicant row for the hiring dashboard */
export interface HiringApplicant {
  id: string;
  profile_id: string;
  full_name: string;
  email: string | null;
  personal_email: string | null;
  submitted_at: string;
  position_selections: HiringPositionSelection[];
}

/** A member of the new exec team derived from Accepted Offer selections */
export interface NewExecTeamMember {
  profile_id: string;
  full_name: string;
  position_name: string;
  is_vp: boolean;
  subteam_name: string | null;
  /** Auth email when linked; used for exec welcome broadcast on finalize. */
  email: string | null;
  computed_role: UserRole;
}

/** Summary returned after finalizing roles */
export interface FinalizeRolesSummary {
  promoted_to_admin: number;
  promoted_to_exec: number;
  demoted_to_member: number;
  /**
   * When set, a marketing broadcast was sent to these addresses; callers may schedule
   * delayed removal from the Resend campaign segment (same pattern as email campaigns).
   */
  exec_welcome_broadcast?: {
    id?: string;
    recipient_emails: string[];
  };
}
