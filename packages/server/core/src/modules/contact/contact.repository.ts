import { BaseRepository } from "@uwdsc/db/base.repository";

export type ContactSource = "contact_form" | "email";

export interface ContactSubmissionData {
  name: string;
  email: string;
  subject: string;
  message: string;
  source: ContactSource;
}

export class ContactRepository extends BaseRepository {
  async insert(data: ContactSubmissionData): Promise<void> {
    await this.sql`
      INSERT INTO public.contact_submissions (name, email, subject, message, source)
      VALUES (${data.name}, ${data.email}, ${data.subject}, ${data.message}, ${data.source})
    `;
  }
}
