import type { FoundryFormValues } from "@/lib/schemas/foundry";
import { foundryFormSchema } from "@/lib/schemas/foundry";

/** Step field slices used for partial trigger validation (Next button enablement). */
export const FOUNDRY_STEP_FIELDS: Record<number, (keyof FoundryFormValues)[]> =
  {
    // Step 1 (Introduction) has no required fields.
    1: [],
    2: ["projectName", "teamAccess"],
    3: ["projectType", "database"],
    4: ["description"],
  };

const STEP2_SCHEMA = foundryFormSchema.pick({
  projectName: true,
  teamAccess: true,
});

const STEP3_SCHEMA = foundryFormSchema.pick({
  projectType: true,
  database: true,
});

const STEP4_SCHEMA = foundryFormSchema.pick({
  description: true,
});

/**
 * Checks if the current step in the Foundry onboarding form is valid.
 * Mirrors the step-level validation approach used in the `apply` flow.
 */
export const isFoundryStepValid = (
  values: Partial<FoundryFormValues>,
  currentStep: number,
): boolean => {
  switch (currentStep) {
    // Step 1 (Introduction) has no required fields.
    case 1:
      return true;

    // Step 2 (Project Details)
    case 2: {
      return STEP2_SCHEMA.safeParse({
        projectName: values.projectName,
        teamAccess: values.teamAccess,
      }).success;
    }

    // Step 3 (Tech Stack & Infrastructure)
    case 3: {
      return STEP3_SCHEMA.safeParse({
        projectType: values.projectType,
        database: values.database,
      }).success;
    }

    // Step 4 (Description)
    case 4: {
      return STEP4_SCHEMA.safeParse({ description: values.description })
        .success;
    }

    default:
      return true;
  }
};
