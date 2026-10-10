import { ContactSource } from "../shared/enums";

export interface ContactSubmissionData {
  name: string;
  email: string;
  subject: string;
  message: string;
  source: ContactSource;
  /** Resend inbound email id, for `source: "email"` rows only. Dedupes webhook replays. */
  resend_email_id?: string;
}

/** A message received through the support channel, either the contact form or an email. */
export interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  source: ContactSource;
  resend_email_id: string | null;
  resolved_at: string | null;
  resolved_by: string | null;
  created_at: string;
}

/** One row in the admin support dashboard. */
export interface ContactSubmissionItem extends ContactSubmission {
  resolver_name: string | null;
}
