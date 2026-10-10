import { ApiError } from "@uwdsc/common/types";
import type { ContactSubmissionItem } from "@uwdsc/common/types";
import { ContactSubmissionRepository } from "./contact.repository";

class ContactSubmissionService {
  private readonly repository: ContactSubmissionRepository;

  constructor() {
    this.repository = new ContactSubmissionRepository();
  }

  async listSubmissions(): Promise<ContactSubmissionItem[]> {
    try {
      return await this.repository.listSubmissions();
    } catch (error) {
      throw new ApiError(`Failed to list contact submissions: ${(error as Error).message}`, 500);
    }
  }

  /** Pass `resolverId: null` to reopen a resolved submission. */
  async setResolved(id: string, resolverId: string | null): Promise<void> {
    try {
      await this.repository.setResolved(id, resolverId);
    } catch (error) {
      throw new ApiError(
        `Failed to update contact submission: ${(error as Error).message}`,
        500
      );
    }
  }
}

export const contactSubmissionService = new ContactSubmissionService();
