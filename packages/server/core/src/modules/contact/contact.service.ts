import { ApiError, type ContactSubmissionData } from "@uwdsc/common/types";
import { ContactRepository } from "./contact.repository";

const TITLE_MAX = 256;
const DESCRIPTION_MAX = 4096;

function truncate(value: string, max: number): string {
  return value.length > max ? `${value.slice(0, max - 3)}...` : value;
}

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

  /**
   * Post a contact form submission to the support Discord webhook.
   * Best-effort: never throws, so a missing or failing webhook cannot fail the submission.
   */
  async notifyDiscord(data: ContactSubmissionData): Promise<void> {
    const webhookUrl = process.env.SUPPORT_DISCORD_WEBHOOK_URL;
    if (!webhookUrl) {
      console.warn("[ContactService] Missing SUPPORT_DISCORD_WEBHOOK_URL, skipping Discord notify");
      return;
    }

    const embed = {
      title: truncate(data.subject, TITLE_MAX),
      author: { name: `${data.name} (${data.email})` },
      description: truncate(data.message, DESCRIPTION_MAX),
      footer: { text: "Via the contact form" },
      timestamp: new Date().toISOString(),
    };

    try {
      await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ embeds: [embed] }),
      });
    } catch (err) {
      console.error("[ContactService] Failed to post contact submission to Discord:", err);
    }
  }
}

export const contactService = new ContactService();
