import { z } from "zod";

// Schema matching the `exec_form_submissions` table
export const onboardingSchema = z.object({
  fullname: z.string().min(2, "Full name is required"),
  gmail: z.email("A valid email is required"),
  role: z.string().min(1, "Please select an executive position"),
  in_waterloo: z.string().optional(),
  term_type: z.enum(["study", "coop"], { message: "Please select study or co-op term" }),
  instagram: z.string().max(30).optional(),
  headshot_url: z.string().optional(),
  consent_website: z.boolean().optional(),
  consent_instagram: z.boolean().optional(),
  discord: z.string().max(32),
  datasci_competency: z.number().int().min(0).max(4),
  anything_else: z.string().optional(),
});

export type OnboardingFormValues = z.infer<typeof onboardingSchema>;

export const OnboardingDefaultValues: Partial<OnboardingFormValues> = {
  gmail: "",
  fullname: "",
  role: "",
  in_waterloo: undefined,
  term_type: "study",
  instagram: undefined,
  headshot_url: undefined,
  consent_website: false,
  consent_instagram: false,
  discord: undefined,
  datasci_competency: 2,
  anything_else: undefined
};
