import { BaseRepository } from "@uwdsc/db/baseRepository";
import { Event } from "@uwdsc/common/types";

export class EventRepository extends BaseRepository {
  /**
   * Get all events ordered by start_time descending
   */
  async getAllEvents(): Promise<Event[]> {
    try {
      const result = await this.sql<Event[]>`
        SELECT
          id,
          name,
          description,
          location,
          image_url,
          start_time,
          end_time,
          buffered_start_time,
          buffered_end_time
        FROM events
        ORDER BY start_time DESC
      `;

      return result;
    } catch (error: unknown) {
      console.error("Error fetching all events:", error);
      throw error;
    }
  }

  /**
   * Get a single event by ID
   * @param eventId - The event UUID
   */
  async getEventById(eventId: string): Promise<Event | null> {
    try {
      const result = await this.sql<Event[]>`
        SELECT
          id,
          name,
          description,
          location,
          image_url,
          start_time,
          end_time,
          buffered_start_time,
          buffered_end_time
        FROM events
        WHERE id = ${eventId}
        LIMIT 1
      `;

      return result[0] ?? null;
    } catch (error: unknown) {
      console.error("Error fetching event by ID:", error);
      throw error;
    }
  }
}
