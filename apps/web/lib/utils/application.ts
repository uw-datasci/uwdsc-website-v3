import type { PositionsWithQuestionsResponse } from "@/types/application";
import { AppFormValues } from "@/lib/schemas/application";
import { UseFormReturn } from "react-hook-form";
import type { ApplicationWithDetails, PositionWithQuestions } from "@uwdsc/common/types";

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
      if (pos1?.position_id === p.id) pos1Answers[a.question_id] = a.answer_text;
      else if (pos2?.position_id === p.id) pos2Answers[a.question_id] = a.answer_text;
      else if (pos3?.position_id === p.id) pos3Answers[a.question_id] = a.answer_text;
      break;
    }
  }

  return { generalAnswers, pos1Answers, pos2Answers, pos3Answers };
}

/**
 * Resolve a saved position selection to a form value, dropping it if the
 * position is no longer open. `positionsData.positions` only lists positions
 * currently open for applications, so a role closed after the draft was
 * saved won't be found here -- restoring its id verbatim would leave the
 * select showing blank (its name isn't in the options list) while the form
 * still silently held a stale id. Returning "" instead makes the field
 * genuinely empty, so the required-field validation catches it and the
 * applicant has to pick an open role.
 */
export function openPositionSelection(
  selection: { position_id: string } | undefined,
  positionsData: PositionsWithQuestionsResponse,
): string {
  if (!selection) return "";
  const isOpen = positionsData.positions.some((p) => p.id === selection.position_id);
  return isOpen ? selection.position_id : "";
}

type AnswerPair = { question_id: string; answer_text: string };

interface QuestionContext {
  positions: PositionWithQuestions[];
  generalQuestionIds: string[];
}

/**
 * Pick only the answers belonging to `questionIds`. Answers left behind by a
 * previously selected position stay in form state under their own question ids,
 * so keying off the expected ids drops them.
 */
function pickAnswers(
  record: Record<string, string> | undefined,
  questionIds: string[],
): AnswerPair[] {
  if (!record) return [];
  const pairs: AnswerPair[] = [];
  for (const question_id of questionIds) {
    const answer_text = record[question_id];
    if (answer_text) pairs.push({ question_id, answer_text });
  }
  return pairs;
}

/**
 * Collect general + position answers into a single array for API payloads,
 * scoped to the questions of the currently selected positions.
 */
export function collectAllAnswers(
  values: {
    general_answers?: Record<string, string>;
    position_1?: string;
    position_1_answers?: Record<string, string>;
    position_2?: string;
    position_2_answers?: Record<string, string>;
    position_3?: string;
    position_3_answers?: Record<string, string>;
  },
  context: QuestionContext,
): AnswerPair[] {
  const questionIdsFor = (positionId: string | undefined) =>
    positionId
      ? (context.positions.find((p) => p.id === positionId)?.questions ?? []).map(
          (q) => q.id,
        )
      : [];

  const pairs = [
    ...pickAnswers(values.general_answers, context.generalQuestionIds),
    ...pickAnswers(values.position_1_answers, questionIdsFor(values.position_1)),
    ...pickAnswers(values.position_2_answers, questionIdsFor(values.position_2)),
    ...pickAnswers(values.position_3_answers, questionIdsFor(values.position_3)),
  ];

  // hiring.answers has no unique constraint on (application_id, question_id),
  // so duplicates would insert as extra rows.
  return [...new Map(pairs.map((p) => [p.question_id, p])).values()];
}

/** Build position_selections array from form position_1/2/3. */
export function buildPositionSelections(values: {
  position_1?: string;
  position_2?: string;
  position_3?: string;
}): { position_id: string; priority: number }[] {
  const list: { position_id: string; priority: number }[] = [];
  if (values.position_1) list.push({ position_id: values.position_1, priority: 1 });
  if (values.position_2) list.push({ position_id: values.position_2, priority: 2 });
  if (values.position_3) list.push({ position_id: values.position_3, priority: 3 });
  return list;
}

/**
 * Checks if the current step in the application form is valid
 */
export const isStepValid = (
  form: UseFormReturn<AppFormValues>,
  currentStep: number,
  context: QuestionContext,
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
        // Check each expected question id rather than counting entries: answers
        // left over from a previously selected position inflate the count.
        return positionData.questions.every((q) => {
          const answer = answers[q.id];
          return (
            !!answer && answer.trim().length >= 1 && answer.trim().length <= 1000
          );
        });
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
      return (
        !errors.resumeKey &&
        !errors.linkedin_url &&
        !errors.github_url &&
        !errors.portfolio_url &&
        !!form.watch("resumeKey") &&
        !!form.watch("linkedin_url") &&
        !!form.watch("github_url")
      );
    default:
      return true;
  }
};
