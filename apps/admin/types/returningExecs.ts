import type {
  ReturningExecListItem,
  ReturningExecOwnSubmission,
} from "@uwdsc/common/types";
import type { PositionReviewScopeDto } from "./applications";

export interface ReturningExecsResponse {
  submissions: ReturningExecListItem[];
  positionReview: PositionReviewScopeDto;
}

export interface OwnSubmissionResponse {
  submission: ReturningExecOwnSubmission | null;
}

export interface AvailablePosition {
  id: number;
  position_id: number;
  name: string;
}
