import type { GeneralQuestion, PositionWithQuestions } from "@uwdsc/common/types";

export interface PositionsWithQuestionsResponse {
  generalQuestions: GeneralQuestion[];
  positions: PositionWithQuestions[];
}

export interface ApplyWindowOpenResponse {
  open: boolean;
}
