import { UseFormReturn } from "react-hook-form";
import { AppFormValues } from "@/lib/schemas/application";

/**
 * Checks if the current step in the application form is valid
 * @param form - The react-hook-form instance
 * @param currentStep - The current step number (0-5)
 * @returns boolean indicating if the step is valid
 */
export const isStepValid = (
  form: UseFormReturn<AppFormValues>,
  currentStep: number
): boolean => {
  const { errors } = form.formState;

  switch (currentStep) {
    // TODO: Implement validation for each steps
    case 1: // Personal Details
      return true;
    case 2: // Education
      const universityName = form.watch("university_name");
      const program = form.watch("program");
      const universityNameOther = form.watch("university_name_other");
      const programOther = form.watch("program_other");

      const isUniversityValid =
        !errors.university_name &&
        !!universityName &&
        (universityName !== "Other" || !!universityNameOther);

      const isProgramValid =
        !errors.program && !!program && (program !== "Other" || !!programOther);

      const isYearValid =
        !errors.year_of_study && !!form.watch("year_of_study");

      return isUniversityValid && isProgramValid && isYearValid;
    default:
      return true;
  }
};
