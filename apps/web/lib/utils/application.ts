import type { PositionsWithQuestionsResponse } from "@/lib/api/application";
import { AppFormValues } from "@/lib/schemas/application";
import { UseFormReturn } from "react-hook-form";
import type {
  ApplicationWithDetails,
  PositionWithQuestions,
} from "@uwdsc/common/types";

export function partitionDraftAnswers(
  existing: ApplicationWithDetails,
  positionsData: PositionsWithQuestionsResponse,
): {
  generalAnswers: Record<string, string>;
  pos1Answers: Record<string, string>;
  pos2Answers: Record<string, string>;
  pos3Answers: Record<string, string>;
} {
  const genIds = new Set(positionsData.generalQuestions.map((q) => q.id));
  const generalAnswers: Record<string, string> = {};
  const pos1Answers: Record<string, string> = {};
  const pos2Answers: Record<string, string> = {};
  const pos3Answers: Record<string, string> = {};

  const pos1 = existing.position_selections.find((s) => s.priority === 1);
  const pos2 = existing.position_selections.find((s) => s.priority === 2);
  const pos3 = existing.position_selections.find((s) => s.priority === 3);

  for (const a of existing.answers) {
    if (genIds.has(a.question_id)) {
      generalAnswers[a.question_id] = a.answer_text;
      continue;
    }
    for (const p of positionsData.positions) {
      if (!p.questions.some((pq) => pq.id === a.question_id)) continue;
      if (pos1?.position_id === p.id)
        pos1Answers[a.question_id] = a.answer_text;
      else if (pos2?.position_id === p.id)
        pos2Answers[a.question_id] = a.answer_text;
      else if (pos3?.position_id === p.id)
        pos3Answers[a.question_id] = a.answer_text;
      break;
    }
  }

  return { generalAnswers, pos1Answers, pos2Answers, pos3Answers };
}

type AnswerPair = { question_id: string; answer_text: string };

function recordToAnswerPairs(
  record: Record<string, string> | undefined,
): AnswerPair[] {
  if (!record) return [];
  return Object.entries(record)
    .filter(([, text]) => text)
    .map(([question_id, answer_text]) => ({ question_id, answer_text }));
}

/** Collect general + position answers into a single array for API payloads. */
export function collectAllAnswers(values: {
  general_answers?: Record<string, string>;
  position_1_answers?: Record<string, string>;
  position_2_answers?: Record<string, string>;
  position_3_answers?: Record<string, string>;
}): AnswerPair[] {
  return [
    ...recordToAnswerPairs(values.general_answers),
    ...recordToAnswerPairs(values.position_1_answers),
    ...recordToAnswerPairs(values.position_2_answers),
    ...recordToAnswerPairs(values.position_3_answers),
  ];
}

/** Build position_selections array from form position_1/2/3. */
export function buildPositionSelections(values: {
  position_1?: string;
  position_2?: string;
  position_3?: string;
}): { position_id: string; priority: number }[] {
  const list: { position_id: string; priority: number }[] = [];
  if (values.position_1)
    list.push({ position_id: values.position_1, priority: 1 });
  if (values.position_2)
    list.push({ position_id: values.position_2, priority: 2 });
  if (values.position_3)
    list.push({ position_id: values.position_3, priority: 3 });
  return list;
}

interface ValidationContext {
  positions: PositionWithQuestions[];
  generalQuestionIds: string[];
}

/**
 * Checks if the current step in the application form is valid
 */
export const isStepValid = (
  form: UseFormReturn<AppFormValues>,
  currentStep: number,
  context: ValidationContext,
): boolean => {
  const { errors } = form.formState;
  const { positions, generalQuestionIds } = context;

  switch (currentStep) {
    case 1: // Personal Details
      return (
        !errors.full_name &&
        !errors.personal_email &&
        !errors.waterloo_email &&
        !errors.program &&
        !errors.academic_term &&
        !errors.location &&
        !errors.club_experience &&
        !!form.watch("full_name") &&
        !!form.watch("personal_email") &&
        !!form.watch("waterloo_email") &&
        !!form.watch("program") &&
        !!form.watch("academic_term") &&
        !!form.watch("location") &&
        form.watch("club_experience") !== undefined
      );
    case 2: {
      // General - dynamic questions
      const generalAnswers = form.watch("general_answers") || {};
      const allAnswered = generalQuestionIds.every(
        (id) =>
          generalAnswers[id] &&
          generalAnswers[id].trim().length >= 1 &&
          generalAnswers[id].trim().length <= 1000,
      );
      return !errors.general_answers && allAnswered;
    }
    case 3: {
      const position1 = form.watch("position_1");
      const position2 = form.watch("position_2");
      const position3 = form.watch("position_3");

      const position1Answers = form.watch("position_1_answers") || {};
      const position2Answers = form.watch("position_2_answers") || {};
      const position3Answers = form.watch("position_3_answers") || {};

      const validatePositionAnswers = (
        positionId: string | undefined,
        answers: Record<string, string>,
      ): boolean => {
        if (!positionId) return true;
        const positionData = positions.find((p) => p.id === positionId);
        if (!positionData) return false;
        const answerValues = Object.values(answers);
        const expectedQuestionCount = positionData.questions.length;
        return (
          answerValues.length === expectedQuestionCount &&
          answerValues.every((a) => a && a.trim().length >= 10)
        );
      };

      return (
        !!position1 &&
        !errors.position_1 &&
        validatePositionAnswers(position1, position1Answers) &&
        validatePositionAnswers(position2, position2Answers) &&
        validatePositionAnswers(position3, position3Answers) &&
        !errors.position_1_answers &&
        !errors.position_2_answers &&
        !errors.position_3_answers
      );
    }
    case 4: // Resume
      return !errors.resumeKey && !!form.watch("resumeKey");
    default:
      return true;
  }
};
