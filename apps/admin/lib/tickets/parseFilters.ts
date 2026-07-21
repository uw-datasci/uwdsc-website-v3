import type { TicketFilters, TicketSource } from "@uwdsc/common/types";

const SOURCES = new Set<TicketSource>(["contact_form", "email"]);

function parseSource(value: string | null): TicketSource | undefined {
  if (!value) return undefined;
  return SOURCES.has(value as TicketSource) ? (value as TicketSource) : undefined;
}

function parsePage(value: string | null): number | undefined {
  if (!value) return undefined;
  const page = Number.parseInt(value, 10);
  return Number.isFinite(page) && page > 0 ? page : undefined;
}

export function parseTicketFilters(searchParams: URLSearchParams): TicketFilters {
  return {
    source: parseSource(searchParams.get("source")),
    search: searchParams.get("search")?.trim() || undefined,
    page: parsePage(searchParams.get("page")) ?? 1,
    pageSize: parsePage(searchParams.get("pageSize")) ?? 20,
  };
}
