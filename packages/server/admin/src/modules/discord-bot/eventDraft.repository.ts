import { BaseRepository } from "@uwdsc/db/base.repository";
import type { EventCategory } from "@uwdsc/common/types";
import type { DiscordEventDraft, DraftSubmission, ExtractedEvent } from "../../types/discord";

export interface CreateDraftData extends ExtractedEvent {
  initiator_discord_id: string;
  guild_id: string;
  channel_id: string;
}

/**
 * events.discord_event_drafts - one row per /event-create run. Every mutation that a user
 * can trigger is guarded by `status = 'pending'` so a stale or double click can't resurrect a
 * finished draft.
 */
export class EventDraftRepository extends BaseRepository {
  async create(data: CreateDraftData): Promise<DiscordEventDraft> {
    const result = await this.sql<DiscordEventDraft[]>`
      INSERT INTO events.discord_event_drafts (
        initiator_discord_id, guild_id, channel_id,
        name, location, description, start_time, end_time, category
      )
      VALUES (
        ${data.initiator_discord_id},
        ${data.guild_id},
        ${data.channel_id},
        ${data.name},
        ${data.location},
        ${data.description},
        ${data.start_time},
        ${data.end_time},
        ${data.category}
      )
      RETURNING *
    `;
    const draft = result[0];
    if (!draft) throw new Error("Failed to insert discord event draft");
    return draft;
  }

  async getById(id: string): Promise<DiscordEventDraft | null> {
    const result = await this.sql<DiscordEventDraft[]>`
      SELECT * FROM events.discord_event_drafts WHERE id = ${id} LIMIT 1
    `;
    return result[0] ?? null;
  }

  async setCardMessage(id: string, channelId: string, messageId: string): Promise<void> {
    await this.sql`
      UPDATE events.discord_event_drafts
      SET channel_id = ${channelId}, message_id = ${messageId}
      WHERE id = ${id}
    `;
  }

  async updateCategory(id: string, category: EventCategory): Promise<DiscordEventDraft | null> {
    const result = await this.sql<DiscordEventDraft[]>`
      UPDATE events.discord_event_drafts
      SET category = ${category}
      WHERE id = ${id} AND status = 'pending'
      RETURNING *
    `;
    return result[0] ?? null;
  }

  async saveSubmission(id: string, values: DraftSubmission): Promise<void> {
    await this.sql`
      UPDATE events.discord_event_drafts
      SET submitted_name = ${values.name},
          submitted_location = ${values.location},
          submitted_start = ${values.start},
          submitted_end = ${values.end},
          submitted_description = ${values.description}
      WHERE id = ${id} AND status = 'pending'
    `;
  }

  /**
   * Atomically move a live draft from pending to created. Only one concurrent submit can win
   * this UPDATE, so a double submit can never create two events.
   */
  async claimForCreation(id: string): Promise<DiscordEventDraft | null> {
    const result = await this.sql<DiscordEventDraft[]>`
      UPDATE events.discord_event_drafts
      SET status = 'created'
      WHERE id = ${id} AND status = 'pending' AND expires_at > now()
      RETURNING *
    `;
    return result[0] ?? null;
  }

  /** Undo a claim when the event insert itself failed, so the user can retry. */
  async releaseClaim(id: string): Promise<void> {
    await this.sql`
      UPDATE events.discord_event_drafts
      SET status = 'pending'
      WHERE id = ${id} AND status = 'created' AND created_event_id IS NULL
    `;
  }

  async setCreatedEvent(id: string, eventId: string): Promise<void> {
    await this.sql`
      UPDATE events.discord_event_drafts
      SET created_event_id = ${eventId}
      WHERE id = ${id}
    `;
  }

  async cancel(id: string): Promise<DiscordEventDraft | null> {
    const result = await this.sql<DiscordEventDraft[]>`
      UPDATE events.discord_event_drafts
      SET status = 'cancelled'
      WHERE id = ${id} AND status = 'pending'
      RETURNING *
    `;
    return result[0] ?? null;
  }
}
