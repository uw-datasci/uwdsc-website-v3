import { z } from "zod";

/**
 * Membership proof-of-payment form.
 *
 * The file is deliberately not part of this schema. It is held in component
 * state and only uploaded when the form is submitted, so browsing away after
 * picking a file leaves nothing behind in the bucket.
 */
export const membershipSubmissionSchema = z.object({
  first_name: z.string().trim().min(1, "First name is required"),
  last_name: z.string().trim().min(1, "Last name is required"),
  wat_iam: z.string().trim().min(1, "WatIAM is required"),
  contact_email: z.email("Enter a valid email address"),
  program: z.string().trim().min(1, "Program is required"),
  // A checkbox is always answered, so this is a plain boolean here even though
  // the column is nullable for email-sourced submissions.
  is_coop_term: z.boolean(),
});

export type MembershipSubmissionFormValues = z.infer<typeof membershipSubmissionSchema>;

export const membershipSubmissionDefaultValues: MembershipSubmissionFormValues = {
  first_name: "",
  last_name: "",
  wat_iam: "",
  contact_email: "",
  program: "",
  is_coop_term: false,
};

/**
 * Server-side shape for POST /api/membership/submission. The proof metadata is
 * added by the client once the upload that precedes the submit has returned.
 */
export const membershipSubmissionApiSchema = membershipSubmissionSchema.extend({
  proof_key: z.string().min(1, "Please upload your proof of payment"),
  proof_file_name: z.string().min(1),
  proof_mime_type: z.string().min(1),
  proof_size_bytes: z.number().int().positive(),
});
