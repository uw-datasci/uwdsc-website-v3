import type { ApplicationReviewStatus, UserRole } from "../shared/enums";

/** A position selection enriched with VP/subteam info for the hiring dashboard */
export interface HiringPositionSelection {
  readonly id: string;
  readonly application_id: string;
  readonly position_id: string;
  readonly priority: number;
  readonly status: ApplicationReviewStatus;
  readonly position_name: string;
  readonly is_vp: boolean;
  readonly subteam_name: string | null;
}

/** An applicant row for the hiring dashboard */
export interface HiringApplicant {
  readonly id: string;
  readonly profile_id: string;
  readonly full_name: string;
  readonly email: string | null;
  readonly personal_email: string | null;
  readonly submitted_at: string;
  readonly position_selections: HiringPositionSelection[];
}

/** A member of the new exec team derived from Accepted Offer selections */
export interface NewExecTeamMember {
  readonly profile_id: string;
  readonly full_name: string;
  readonly position_name: string;
  readonly is_vp: boolean;
  readonly subteam_name: string | null;
  readonly computed_role: UserRole;
}

/** Summary returned after finalizing roles */
export interface FinalizeRolesSummary {
  readonly promoted_to_admin: number;
  readonly promoted_to_exec: number;
  readonly demoted_to_member: number;
}
