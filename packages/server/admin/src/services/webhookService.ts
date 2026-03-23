import { ApiError } from "@uwdsc/common/types";
import { gmailWatchRepository } from "../repositories/gmailWatchRepository";

interface GmailCredentials {
  clientId: string;
  clientSecret: string;
  refreshToken: string;
}

export interface ParsedEmail {
  messageId: string;
  emailAddress: string;
  body: string;
}

class WebhookService {
  private decodePubSubData(encodedData: string) {
    const decodedStr = Buffer.from(encodedData, "base64").toString("utf-8");
    const { emailAddress, historyId } = JSON.parse(decodedStr) as {
      emailAddress: string;
      historyId: string | number;
    };
    return { emailAddress, historyId: String(historyId) };
  }

  private async refreshAccessToken(
    credentials: GmailCredentials,
  ): Promise<string> {
    const response = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: credentials.clientId,
        client_secret: credentials.clientSecret,
        refresh_token: credentials.refreshToken,
        grant_type: "refresh_token",
      }),
    });

    const data = await response.json();

    if (!data.access_token) throw new Error("Failed to obtain access token");

    return data.access_token;
  }

  private async resolveMessageId(
    emailAddress: string,
    startHistoryId: string,
    accessToken: string,
  ): Promise<string | null> {
    const response = await fetch(
      `https://gmail.googleapis.com/gmail/v1/users/${emailAddress}/history?startHistoryId=${startHistoryId}`,
      { headers: { Authorization: `Bearer ${accessToken}` } },
    );

    const data = await response.json();
    const messagesAdded =
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      data.history?.flatMap((h: any) => h.messagesAdded || []) || [];

    if (messagesAdded.length === 0) return null;

    return messagesAdded[0].message.id;
  }

  private async fetchEmailBody(
    emailAddress: string,
    messageId: string,
    accessToken: string,
  ): Promise<string> {
    const response = await fetch(
      `https://gmail.googleapis.com/gmail/v1/users/${emailAddress}/messages/${messageId}?format=full`,
      { headers: { Authorization: `Bearer ${accessToken}` } },
    );

    const data = await response.json();
    const parts = data.payload.parts || [data.payload];
    return this.findTextPlain(parts) ?? "No text content found";
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private findTextPlain(parts: any[]): string | null {
    for (const part of parts) {
      if (part.mimeType === "text/plain" && part.body?.data) {
        // Gmail uses base64url encoding
        return Buffer.from(part.body.data, "base64url").toString("utf-8");
      }
      if (part.parts) {
        const found = this.findTextPlain(part.parts);
        if (found) return found;
      }
    }
    return null;
  }

  /**
   * Processes an incoming Google Pub/Sub Gmail push notification.
   * Decodes the payload, fetches a fresh access token, resolves the
   * triggering message via the History API, and returns the parsed email body.
   */
  async processGmailWebhook(
    encodedData: string,
    credentials: GmailCredentials,
  ): Promise<ParsedEmail | null> {
    try {
      const { emailAddress, historyId: newHistoryIdFromPubSub } =
        this.decodePubSubData(encodedData);
      const accessToken = await this.refreshAccessToken(credentials);

      const storedHistoryId = await gmailWatchRepository.getHistoryId();
      if (storedHistoryId === null) {
        throw new ApiError(
          "gmail_watch_state is not initialized (missing row id=1). Seed history_id from users.watch / Gmail.",
          500,
        );
      }

      const messageId = await this.resolveMessageId(
        emailAddress,
        storedHistoryId,
        accessToken,
      );

      if (!messageId) {
        await gmailWatchRepository.updateHistoryId(newHistoryIdFromPubSub);
        return null;
      }

      const body = await this.fetchEmailBody(
        emailAddress,
        messageId,
        accessToken,
      );

      await gmailWatchRepository.updateHistoryId(newHistoryIdFromPubSub);

      // TODO: verify email has webhook trigger tag

      return { messageId, emailAddress, body };
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError(
        `Failed to process Gmail webhook: ${(error as Error).message}`,
        500,
      );
    }
  }
}

export const webhookService = new WebhookService();
