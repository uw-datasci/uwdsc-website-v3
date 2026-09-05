import { z } from "zod";

/**
 * Approve / reject a membership proof-of-payment submission.
 * A rejection must carry a reason -- the member only sees this string, and it
 * is what tells them what to fix before re-submitting.
 */
export const reviewSubmissionSchema = z
  .object({
    decision: z.enum(["approved", "rejected"]),
    reason: z.string().trim().optional(),
    // Optional: when approving during an active event, also check the member in.
    event_id: z.string().uuid().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.decision === "rejected" && !data.reason) {
      ctx.addIssue({
        code: "custom",
        path: ["reason"],
        message: "A reason is required to reject a submission",
      });
    }
  });

export type ReviewSubmissionFormValues = z.infer<typeof reviewSubmissionSchema>;
