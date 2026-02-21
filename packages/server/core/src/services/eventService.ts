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

  /**
   * Get events currently within their buffered check-in window
   */
  async getActiveEvents(): Promise<Event[]> {
    try {
      return await this.repository.getActiveEvents();
    } catch (error) {
      throw new ApiError(
        `Failed to get active events: ${(error as Error).message}`,
        500,
      );
    }
  }

  /**
   * Get the next upcoming event
   */
  async getNextUpcomingEvent(): Promise<Event | null> {
    try {
      return await this.repository.getNextUpcomingEvent();
    } catch (error) {
      throw new ApiError(
        `Failed to get next upcoming event: ${(error as Error).message}`,
        500,
      );
    }
  }

  /**
   * Check if a user has checked in to an event
   */
  async getAttendanceForUser(
    eventId: string,
    profileId: string,
  ): Promise<boolean> {
    try {
      return await this.repository.getAttendanceForUser(eventId, profileId);
    } catch (error) {
      throw new ApiError(
        `Failed to check attendance: ${(error as Error).message}`,
        500,
      );
    }
  }
}

export const eventService = new EventService();
