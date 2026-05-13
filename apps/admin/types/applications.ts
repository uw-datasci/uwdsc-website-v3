import type { ApplicationListItem } from "@uwdsc/common/types";

export interface PositionReviewScopeDto {
  canUse: boolean;
  isPresident: boolean;
  vpPositionIds: number[];
}

export interface ApplicationsListResponse {
  applications: ApplicationListItem[];
  statusCounts: {
    draft: number;
    submitted: number;
  };
  positionReview: PositionReviewScopeDto;
}
