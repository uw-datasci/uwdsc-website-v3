import { UseFormReturn } from "react-hook-form";
import { RegistrationFormValues } from "@/lib/schemas/register";

/**
 * Checks if the current step in the registration form is valid
 * @param form - The react-hook-form instance
 * @param currentStep - The current step number (0-1)
 * @returns boolean indicating if the step is valid
 */
export const isStepValid = (
  form: UseFormReturn<RegistrationFormValues>,
  currentStep: number,
): boolean => {
  const { errors } = form.formState;

  switch (currentStep) {
    case 0: // Account Info
      return (
        !errors.first_name &&
        !errors.last_name &&
        !errors.email &&
        !errors.password &&
        !!form.watch("first_name") &&
        !!form.watch("last_name") &&
        !!form.watch("email") &&
        !!form.watch("password")
      );
    case 1: // Additional Info
      return (
        !errors.faculty &&
        !errors.term &&
        !errors.heard_from_where &&
        !!form.watch("faculty") &&
        !!form.watch("term") &&
        !!form.watch("heard_from_where")
      );
    default:
      return true;
  }
};
