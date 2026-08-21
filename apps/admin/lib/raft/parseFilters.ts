import type {
  RaftGroupFilters,
  RaftResolvedFilter,
  RaftSeverity,
  RaftTimeRange,
} from "@uwdsc/common/types";

const TIME_RANGES = new Set<RaftTimeRange>(["24h", "7d", "30d"]);
const RESOLVED_FILTERS = new Set<RaftResolvedFilter>(["all", "open", "resolved"]);
const SEVERITIES = new Set<RaftSeverity>(["debug", "info", "warning", "error", "fatal"]);

function parseTimeRange(value: string | null): RaftTimeRange | undefined {
  if (!value) return undefined;
  return TIME_RANGES.has(value as RaftTimeRange) ? (value as RaftTimeRange) : undefined;
}

function parseResolved(value: string | null): RaftResolvedFilter | undefined {
  if (!value) return undefined;
  return RESOLVED_FILTERS.has(value as RaftResolvedFilter)
    ? (value as RaftResolvedFilter)
    : undefined;
}

function parseSeverity(value: string | null): RaftSeverity | undefined {
  if (!value) return undefined;
  return SEVERITIES.has(value as RaftSeverity) ? (value as RaftSeverity) : undefined;
}

function parsePage(value: string | null): number | undefined {
  if (!value) return undefined;
  const page = Number.parseInt(value, 10);
  return Number.isFinite(page) && page > 0 ? page : undefined;
}

export function parseRaftFilters(searchParams: URLSearchParams): RaftGroupFilters {
  const mode = searchParams.get("mode");
  const filters: RaftGroupFilters = {
    appName: searchParams.get("appName") ?? undefined,
    environment: searchParams.get("environment") ?? undefined,
    severity: parseSeverity(searchParams.get("severity")),
    timeRange: parseTimeRange(searchParams.get("timeRange")) ?? "7d",
    resolved: parseResolved(searchParams.get("resolved")) ?? "all",
    page: parsePage(searchParams.get("page")) ?? 1,
    pageSize: parsePage(searchParams.get("pageSize")) ?? 20,
    endpoint: searchParams.get("endpoint") ?? undefined,
    errorMessage: searchParams.get("errorMessage") ?? undefined,
  };

  if (mode === "occurrences" || mode === "groups") filters.mode = mode;

  return filters;
}
