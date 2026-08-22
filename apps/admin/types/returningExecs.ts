import type { ReturningExecListItem, ReturningExecOwnSubmission } from "@uwdsc/common/types";
import type { PositionReviewScopeDto } from "./applications";

export interface ReturningExecsResponse {
  submissions: ReturningExecListItem[];
  positionReview: PositionReviewScopeDto;
}

export interface OwnSubmissionResponse {
  submission: ReturningExecOwnSubmission | null;
}

export interface SelectablePosition {
  /** org.exec_positions.id */
  id: number;
  name: string;
  is_vp: boolean;
  subteam_name: string | null;
}
