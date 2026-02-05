import { UseFormReturn } from "react-hook-form";
import { AppFormValues } from "@/lib/schemas/application";
import { AVAILABLE_POSITIONS } from "@/constants/positions";

/**
 * Checks if the current step in the application form is valid
 * @param form - The react-hook-form instance
 * @param currentStep - The current step number (0-5)
 * @returns boolean indicating if the step is valid
 */
export const isStepValid = (
  form: UseFormReturn<AppFormValues>,
  currentStep: number,
): boolean => {
  const { errors } = form.formState;

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
    case 2: // General
      return (
        !errors.exec_positions &&
        !errors.new_idea &&
        !errors.hobbies &&
        !!form.watch("exec_positions") &&
        !!form.watch("new_idea") &&
        !!form.watch("hobbies")
      );
    case 3: {
      // Positions
      const position1 = form.watch("position_1");
      const position2 = form.watch("position_2");
      const position3 = form.watch("position_3");

      const position1Answers = form.watch("position_1_answers") || {};
      const position2Answers = form.watch("position_2_answers") || {};
      const position3Answers = form.watch("position_3_answers") || {};

      // Helper function to validate position answers
      const validatePositionAnswers = (
        positionId: string | undefined,
        answers: Record<string, string>,
      ): boolean => {
        if (!positionId) return true; // No position selected, so valid

        // Find the position data to get the expected number of questions
        const positionData = AVAILABLE_POSITIONS.find(
          (p) => p.id === positionId,
        );
        if (!positionData) return false;

        const answerValues = Object.values(answers);
        const expectedQuestionCount = positionData.questions.length;

        // Check that we have the correct number of answers and all are filled
        return (
          answerValues.length === expectedQuestionCount &&
          answerValues.every((answer) => answer && answer.trim().length >= 10)
        );
      };

      const hasPosition1 = !!position1;
      const hasPosition1Answers = validatePositionAnswers(
        position1,
        position1Answers,
      );
      const hasPosition2Answers = validatePositionAnswers(
        position2,
        position2Answers,
      );
      const hasPosition3Answers = validatePositionAnswers(
        position3,
        position3Answers,
      );

      return (
        hasPosition1 &&
        !errors.position_1 &&
        hasPosition1Answers &&
        !errors.position_1_answers &&
        hasPosition2Answers &&
        !errors.position_2_answers &&
        hasPosition3Answers &&
        !errors.position_3_answers
      );
    }
    case 4: // Resume
      return !errors.resumeUrl && !!form.watch("resumeUrl");
    default:
      return true;
  }
};
