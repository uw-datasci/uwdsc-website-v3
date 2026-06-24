import { BaseRepository } from "@uwdsc/db/base.repository";

export interface ContactSubmissionData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export class ContactRepository extends BaseRepository {
  async insert(data: ContactSubmissionData): Promise<void> {
    await this.sql`
      INSERT INTO public.contact_submissions (name, email, subject, message)
      VALUES (${data.name}, ${data.email}, ${data.subject}, ${data.message})
    `;
  }
}
