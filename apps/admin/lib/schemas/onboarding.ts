import { z } from "zod";

// Schema matching the `exec_form_submissions` table
export const onboardingSchema = z.object({
  fullname: z.string().min(2, "Full name is required"),
  email: z
    .email("A valid gmail is required")
    .refine(
      (email) => email.toLowerCase().endsWith("@gmail.com"),
      "Please use a personal gmail address",
    ),
  role_id: z.int({ message: "Please select a role" }),
  in_waterloo: z.string().min(1, "Please indicate your location next term"),
  term_type: z.enum(["study", "coop"], {
    message: "Please select study or co-op term",
  }),
  instagram: z.string().max(30).optional().nullable(),
  headshot_url: z.string().optional().nullable(),
  consent_website: z.boolean(),
  consent_instagram: z.boolean(),
  discord: z.string().max(32),
  datasci_competency: z.number().int().min(0).max(4),
  anything_else: z.string().optional().nullable(),
});

export type OnboardingFormValues = z.infer<typeof onboardingSchema>;

export const OnboardingDefaultValues: Partial<OnboardingFormValues> = {
  email: "",
  fullname: "",
  role_id: 0,
  in_waterloo: "",
  term_type: "study",
  instagram: "",
  headshot_url: "",
  consent_website: false,
  consent_instagram: false,
  discord: "",
  datasci_competency: 2,
  anything_else: "",
};
