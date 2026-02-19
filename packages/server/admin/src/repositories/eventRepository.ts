import { BaseRepository } from "@uwdsc/db/baseRepository";
import { CreateEventData, Event } from "@uwdsc/common/types";

export class EventRepository extends BaseRepository {
  /**
   * Create a new event
   * @param data - Event data to insert
   */
  async createEvent(data: CreateEventData): Promise<Event | null> {
    try {
      const result = await this.sql<Event[]>`
        INSERT INTO events (name, description, location, image_url, start_time, end_time)
        VALUES (
          ${data.name},
          ${data.description},
          ${data.location},
          ${data.image_url ?? null},
          ${data.start_time},
          ${data.end_time}
        )
        RETURNING *
      `;

      return result[0] ?? null;
    } catch (error: unknown) {
      console.error("Error creating event:", error);
      throw error;
    }
  }

  /**
   * Update an event by ID (partial update — only provided fields are changed)
   * @param eventId - The event UUID
   * @param data - Fields to update
   * @param columns - Column names to update (must match keys in data)
   */
  async updateEventById(
    eventId: string,
    data: Record<string, string | null>,
    columns: string[],
  ): Promise<boolean> {
    try {
      const result = await this.sql`
        UPDATE events
        SET ${this.sql(data, ...columns)}, updated_at = NOW()
        WHERE id = ${eventId}
        RETURNING id
      `;

      return result.length > 0;
    } catch (error: unknown) {
      console.error("Error updating event:", error);
      throw error;
    }
  }

  /**
   * Delete an event by ID
   * @param eventId - The event UUID
   */
  async deleteEventById(eventId: string): Promise<boolean> {
    try {
      const result = await this.sql`
        DELETE FROM events
        WHERE id = ${eventId}
        RETURNING id
      `;

      return result.length > 0;
    } catch (error: unknown) {
      console.error("Error deleting event:", error);
      throw error;
    }
  }
}
