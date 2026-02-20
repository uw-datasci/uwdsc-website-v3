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

  /**
   * Get events currently within their buffered check-in window
   */
  async getActiveEvents(): Promise<Event[]> {
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
        WHERE NOW() BETWEEN buffered_start_time AND buffered_end_time
        ORDER BY start_time ASC
      `;

      return result;
    } catch (error: unknown) {
      console.error("Error fetching active events:", error);
      throw error;
    }
  }

  /**
   * Get the next upcoming event (start_time in the future)
   */
  async getNextUpcomingEvent(): Promise<Event | null> {
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
        WHERE start_time > NOW()
        ORDER BY start_time ASC
        LIMIT 1
      `;

      return result[0] ?? null;
    } catch (error: unknown) {
      console.error("Error fetching next upcoming event:", error);
      throw error;
    }
  }

  /**
   * Check if a user has an attendance record for a given event
   */
  async getAttendanceForUser(
    eventId: string,
    profileId: string,
  ): Promise<boolean> {
    try {
      const result = await this.sql<{ exists: boolean }[]>`
        SELECT EXISTS(
          SELECT 1 FROM attendance
          WHERE event_id = ${eventId} AND profile_id = ${profileId}
        ) AS exists
      `;

      return result[0]?.exists ?? false;
    } catch (error: unknown) {
      console.error("Error checking attendance:", error);
      throw error;
    }
  }
}
