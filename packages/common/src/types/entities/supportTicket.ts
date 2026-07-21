export type TicketSource = "contact_form" | "email";

export interface SupportTicket {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  source: TicketSource;
  createdAt: string;
}

export interface TicketFilters {
  source?: TicketSource;
  search?: string;
  page?: number;
  pageSize?: number;
}

export interface TicketStats {
  total: number;
  contactFormCount: number;
  emailCount: number;
  last7Days: number;
}

export interface TicketTimeSeriesPoint {
  date: string;
  contactForm: number;
  email: number;
}

export interface TicketOverview {
  stats: TicketStats;
  timeSeries: TicketTimeSeriesPoint[];
}

export interface TicketsResponse {
  tickets: SupportTicket[];
  total: number;
  page: number;
  pageSize: number;
}
