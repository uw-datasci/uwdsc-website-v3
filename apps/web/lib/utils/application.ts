import { UseFormReturn } from "react-hook-form";
import { AppFormValues } from "@/lib/schemas/application";
import type { PositionWithQuestions } from "@uwdsc/common/types";

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
      const allAnswered =
        generalQuestionIds.every(
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
