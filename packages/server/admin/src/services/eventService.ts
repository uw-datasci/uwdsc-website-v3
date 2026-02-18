import { EventRepository } from "../repositories/eventRepository";
import {
  ApiError,
  CreateEventData,
  Event,
  UpdateEventData,
} from "@uwdsc/common/types";
import { filterPartialUpdate } from "@uwdsc/common/utils";

const UPDATE_EVENT_COLUMNS = [
  "name",
  "description",
  "location",
  "image_url",
  "start_time",
  "end_time",
] as const;

class EventService {
  private readonly repository: EventRepository;

  constructor() {
    this.repository = new EventRepository();
  }

  /**
   * Create a new event
   */
  async createEvent(
    data: CreateEventData,
  ): Promise<{ success: boolean; event?: Event; error?: string }> {
    try {
      const event = await this.repository.createEvent(data);

      if (!event) {
        return { success: false, error: "Failed to create event" };
      }

      return { success: true, event };
    } catch (error) {
      throw new ApiError(
        `Failed to create event: ${(error as Error).message}`,
        500,
      );
    }
  }

  /**
   * Update an event (partial update — only provided fields are changed)
   */
  async updateEvent(
    eventId: string,
    data: UpdateEventData,
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const { filteredData, columns } = filterPartialUpdate(
        data,
        UPDATE_EVENT_COLUMNS,
      );

      if (columns.length === 0) return { success: true };

      const result = await this.repository.updateEventById(
        eventId,
        filteredData as Record<string, string | null>,
        columns,
      );

      if (!result) {
        return { success: false, error: "Event not found" };
      }

      return { success: true };
    } catch (error) {
      throw new ApiError(
        `Failed to update event: ${(error as Error).message}`,
        500,
      );
    }
  }

  /**
   * Delete an event
   */
  async deleteEvent(
    eventId: string,
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const result = await this.repository.deleteEventById(eventId);

      if (!result) {
        return { success: false, error: "Event not found" };
      }

      return { success: true };
    } catch (error) {
      throw new ApiError(
        `Failed to delete event: ${(error as Error).message}`,
        500,
      );
    }
  }
}

export const eventService = new EventService();
