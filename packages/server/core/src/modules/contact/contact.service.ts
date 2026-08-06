import { ApiError } from "@uwdsc/common/types";
import { ContactRepository, type ContactSubmissionData } from "./contact.repository";

class ContactService {
  private readonly repository: ContactRepository;

  constructor() {
    this.repository = new ContactRepository();
  }

  async submit(data: ContactSubmissionData): Promise<void> {
    try {
      await this.repository.insert(data);
    } catch (error) {
      throw new ApiError(`Failed to save contact submission: ${(error as Error).message}`, 500);
    }
  }
}

export const contactService = new ContactService();
