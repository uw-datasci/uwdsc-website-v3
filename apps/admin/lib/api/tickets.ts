import type { SupportTicket, TicketFilters, TicketOverview, TicketsResponse } from "@uwdsc/common/types";
import { createApiError } from "./error";

function buildTicketQueryParams(filters: TicketFilters): string {
  const params = new URLSearchParams();

  if (filters.source) params.set("source", filters.source);
  if (filters.search) params.set("search", filters.search);
  if (filters.page) params.set("page", String(filters.page));
  if (filters.pageSize) params.set("pageSize", String(filters.pageSize));

  const query = params.toString();
  return query ? `?${query}` : "";
}

export async function getTicketOverview(filters: TicketFilters = {}): Promise<TicketOverview> {
  const response = await fetch(`/api/tickets/overview${buildTicketQueryParams(filters)}`);
  const data = await response.json();

  if (!response.ok) throw createApiError(data, response.status);

  return data as TicketOverview;
}

export async function getTickets(filters: TicketFilters = {}): Promise<TicketsResponse> {
  const response = await fetch(`/api/tickets${buildTicketQueryParams(filters)}`);
  const data = await response.json();

  if (!response.ok) throw createApiError(data, response.status);

  return data as TicketsResponse;
}

export async function getTicket(id: string): Promise<SupportTicket> {
  const response = await fetch(`/api/tickets/${id}`);
  const data = await response.json();

  if (!response.ok) throw createApiError(data, response.status);

  return data.ticket as SupportTicket;
}
