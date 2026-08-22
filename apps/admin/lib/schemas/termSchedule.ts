import { z } from "zod";

/** Mirrors the minimum gap enforced by the `sync_terms_hard_deadline` DB trigger. */
export const HARD_DEADLINE_GRACE_MINUTES = 15;

function isSoftAfterRelease(data: {
  application_release_date: string;
  application_soft_deadline: string;
}): boolean {
  return new Date(data.application_soft_deadline) > new Date(data.application_release_date);
}

function isHardAfterGrace(data: {
  application_soft_deadline: string;
  application_hard_deadline: string;
}): boolean {
  const graceMs = HARD_DEADLINE_GRACE_MINUTES * 60 * 1000;
  return (
    new Date(data.application_hard_deadline).getTime() -
      new Date(data.application_soft_deadline).getTime() >=
    graceMs
  );
}

/**
 * Schedule for the active term's public application window.
 * `application_soft_deadline` is display-only (countdown, due-date pill);
 * `application_hard_deadline` gates the apply page and every application API.
 */
export const termScheduleSchema = z
  .object({
    application_release_date: z.iso.datetime({ error: "Invalid release date" }),
    application_soft_deadline: z.iso.datetime({ error: "Invalid soft deadline" }),
    application_hard_deadline: z.iso.datetime({ error: "Invalid hard deadline" }),
  })
  .refine(isSoftAfterRelease, {
    message: "Soft deadline must be after the release date",
    path: ["application_soft_deadline"],
  })
  .refine(isHardAfterGrace, {
    message: `Hard deadline must be at least ${HARD_DEADLINE_GRACE_MINUTES} minutes after the soft deadline`,
    path: ["application_hard_deadline"],
  });

export type TermScheduleFormValues = z.infer<typeof termScheduleSchema>;
