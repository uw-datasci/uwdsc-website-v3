import type { SupportTicket, TicketFilters, TicketOverview, TicketsResponse } from "@uwdsc/common/types";
import { ApiError } from "@uwdsc/common/types";
import { TicketRepository } from "./ticket.repository";

class TicketService {
  private readonly repository: TicketRepository;

  constructor() {
    this.repository = new TicketRepository();
  }

  async getOverview(filters: TicketFilters): Promise<TicketOverview> {
    try {
      const [stats, timeSeries] = await Promise.all([
        this.repository.getStats(filters),
        this.repository.getTimeSeries(filters),
      ]);

      return { stats, timeSeries };
    } catch (error) {
      throw new ApiError(`Failed to fetch ticket overview: ${(error as Error).message}`, 500);
    }
  }

  async getTickets(filters: TicketFilters): Promise<TicketsResponse> {
    try {
      const { tickets, total } = await this.repository.list(filters);
      const page = filters.page ?? 1;
      const pageSize = filters.pageSize ?? 20;

      return { tickets, total, page, pageSize };
    } catch (error) {
      throw new ApiError(`Failed to fetch tickets: ${(error as Error).message}`, 500);
    }
  }

  async getTicketById(id: string): Promise<SupportTicket | null> {
    try {
      return await this.repository.getById(id);
    } catch (error) {
      throw new ApiError(`Failed to fetch ticket: ${(error as Error).message}`, 500);
    }
  }
}

export const ticketService = new TicketService();
