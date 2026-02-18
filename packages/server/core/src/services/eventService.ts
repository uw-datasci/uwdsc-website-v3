import { EventRepository } from "../repositories/eventRepository";
import { ApiError, Event } from "@uwdsc/common/types";

class EventService {
  private readonly repository: EventRepository;

  constructor() {
    this.repository = new EventRepository();
  }

  /**
   * Get all events
   */
  async getAllEvents(): Promise<Event[]> {
    try {
      return await this.repository.getAllEvents();
    } catch (error) {
      throw new ApiError(
        `Failed to get all events: ${(error as Error).message}`,
        500,
      );
    }
  }

  /**
   * Get a single event by ID
   */
  async getEventById(eventId: string): Promise<Event | null> {
    try {
      return await this.repository.getEventById(eventId);
    } catch (error) {
      throw new ApiError(
        `Failed to get event: ${(error as Error).message}`,
        500,
      );
    }
  }
}

export const eventService = new EventService();
