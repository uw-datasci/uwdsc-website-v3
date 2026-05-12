import type { FinalizeRolesSummary, HiringApplicant, NewExecTeamMember } from "@uwdsc/common/types";

export interface HiringApplicantsResponse {
  applicants: HiringApplicant[];
}

export interface NewExecTeamResponse {
  team: NewExecTeamMember[];
}

export interface FinalizeRolesResponse {
  summary: FinalizeRolesSummary;
}
