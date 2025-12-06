import { UseFormReturn } from "react-hook-form";
import { AppFormValues } from "@/lib/schemas/application";

/**
 * Checks if the current step in the application form is valid for Desktop
 * @param form - The react-hook-form instance
 * @param currentStep - The current step number (0-2)
 * @returns boolean indicating if the step is valid
 */
export const isDesktopStepValid = (
  form: UseFormReturn<AppFormValues>,
  currentStep: number,
): boolean => {
  const { errors } = form.formState;

  switch (currentStep) {
    case 0: {
      // Personal Details
      const dietary_restrictions = form.watch("dietary_restrictions");
      const dietary_restrictions_other = form.watch(
        "dietary_restrictions_other",
      );
      const tshirt_size = form.watch("tshirt_size");

      const validAboutYou =
        !errors.dietary_restrictions &&
        dietary_restrictions !== undefined &&
        !errors.tshirt_size &&
        tshirt_size !== undefined &&
        !errors.dietary_restrictions_other &&
        (dietary_restrictions !== "Other" ||
          (dietary_restrictions_other?.trim().length ?? 0) > 0) &&
        !errors.gender &&
        !errors.ethnicity;

      const validContactInfo =
        !errors.email && !errors.phone && !errors.discord;

      return validAboutYou && validContactInfo;
    }
    case 1: {
      // Experience
      const universityName = form.watch("university_name");
      const program = form.watch("program");
      const universityNameOther = form.watch("university_name_other");
      const programOther = form.watch("program_other");

      const prior_hackathon_experience = form.watch(
        "prior_hackathon_experience",
      );
      const hackathons_attended = form.watch("hackathons_attended");
      const year = form.watch("year_of_study");

      const isUniversityValid =
        !errors.university_name &&
        !!universityName &&
        (universityName !== "Other" || !!universityNameOther);

      const isProgramValid =
        !errors.program && !!program && (program !== "Other" || !!programOther);

      const isYearValid = !errors.year_of_study && !!year;

      const validHackExp =
        !errors.prior_hackathon_experience &&
        !errors.resume &&
        !errors.github &&
        !errors.linkedin &&
        !errors.other_link &&
        !errors.hackathons_attended &&
        prior_hackathon_experience.length > 0 &&
        hackathons_attended !== undefined;

      return isUniversityValid && isProgramValid && isYearValid && validHackExp;
    }
    case 2: {
      // CxC App
      const CxCGain = form.watch("cxc_gain");
      const SillyQ = form.watch("silly_q");
      return !errors.cxc_gain && !!CxCGain && !errors.silly_q && !!SillyQ;
    }
    default:
      return true;
  }
};

/**
 * Checks if the current step in the application form is valid for Mobile
 * @param form - The react-hook-form instance
 * @param currentStep - The current step number (0-6)
 * @returns boolean indicating if the step is valid
 */
export const isMobileStepValid = (
  form: UseFormReturn<AppFormValues>,
  currentStep: number,
): boolean => {
  const { errors } = form.formState;

  switch (currentStep) {
    case 0: {
      // Contact Info
      const email = form.watch("email");
      const phone = form.watch("phone");
      const discord = form.watch("discord");

      const validContactInfo =
        !errors.email &&
        !!email &&
        !errors.phone &&
        !!phone &&
        !!discord &&
        !errors.discord;
      return validContactInfo;
    }
    case 1: {
      // About You
      const dietary_restrictions = form.watch("dietary_restrictions");
      const dietary_restrictions_other = form.watch(
        "dietary_restrictions_other",
      );
      const tshirt_size = form.watch("tshirt_size");

      const validAboutYou =
        !errors.dietary_restrictions &&
        dietary_restrictions !== undefined &&
        !errors.tshirt_size &&
        tshirt_size !== undefined &&
        !errors.dietary_restrictions_other &&
        (dietary_restrictions !== "Other" ||
          (dietary_restrictions_other?.trim().length ?? 0) > 0) &&
        !errors.gender &&
        !errors.ethnicity;
      return validAboutYou;
    }
    case 2: {
      // Education
      const universityName = form.watch("university_name");
      const program = form.watch("program");
      const universityNameOther = form.watch("university_name_other");
      const programOther = form.watch("program_other");
      const year = form.watch("year_of_study");

      const isUniversityValid =
        !errors.university_name &&
        !!universityName &&
        (universityName !== "Other" || !!universityNameOther);

      const isProgramValid =
        !errors.program && !!program && (program !== "Other" || !!programOther);

      const isYearValid = !errors.year_of_study && !!year;

      return isUniversityValid && isProgramValid && isYearValid;
    }
    case 3: {
      // Hackathon Experience
      const hackathons_attended = form.watch("hackathons_attended");
      const prior_hackathon_experience = form.watch(
        "prior_hackathon_experience",
      );
      const validHackExp =
        !errors.prior_hackathon_experience &&
        !errors.hackathons_attended &&
        prior_hackathon_experience.length > 0 &&
        hackathons_attended !== undefined;
      return validHackExp;
    }
    case 4: // Links & Documents
      return (
        !errors.github &&
        !errors.linkedin &&
        !errors.x &&
        !errors.other_link &&
        !errors.resume
      );
    case 5: {
      // CxC Gain
      const CxCGain = form.watch("cxc_gain");
      return !errors.cxc_gain && !!CxCGain;
    }
    case 6: {
      // Silly Q
      const SillyQ = form.watch("silly_q");
      return !errors.silly_q && !!SillyQ;
    }
    default:
      return true;
  }
};
