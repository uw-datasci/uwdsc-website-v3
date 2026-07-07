export type RaftSeverity = "debug" | "info" | "warning" | "error" | "fatal";

export type RaftTimeRange = "24h" | "7d" | "30d";

export type RaftResolvedFilter = "all" | "open" | "resolved";

export interface RaftErrorMetadata {
  route?: string;
  method?: string;
  url?: string;
  [key: string]: unknown;
}

export interface RaftError {
  id: string;
  app_name: string;
  environment: string;
  error_message: string;
  stack_trace: string | null;
  severity: RaftSeverity;
  metadata: RaftErrorMetadata;
  resolved: boolean;
  created_at: string;
}

export interface RaftFilters {
  appName?: string;
  environment?: string;
  severity?: RaftSeverity;
  timeRange?: RaftTimeRange;
  resolved?: RaftResolvedFilter;
  page?: number;
  pageSize?: number;
}

export interface RaftGroupFilters extends RaftFilters {
  endpoint?: string;
  errorMessage?: string;
  mode?: "groups" | "occurrences";
}

export interface RaftStats {
  total_errors: number;
  open_errors: number;
  critical_errors: number;
  distinct_apps: number;
}

export interface RaftTimeSeriesPoint {
  bucket: string;
  debug: number;
  info: number;
  warning: number;
  error: number;
  fatal: number;
  total: number;
}

export interface RaftAppBreakdown {
  app_name: string;
  count: number;
}

export interface RaftSeverityBreakdown {
  severity: RaftSeverity;
  count: number;
}

export interface RaftEndpointBreakdown {
  endpoint: string;
  count: number;
}

export interface RaftErrorGroup {
  app_name: string;
  endpoint: string;
  error_message: string;
  count: number;
  first_seen: string;
  last_seen: string;
  latest_severity: RaftSeverity;
  resolved_count: number;
  latest_id: string;
}

export interface RaftOverview {
  stats: RaftStats;
  timeSeries: RaftTimeSeriesPoint[];
  byApp: RaftAppBreakdown[];
  bySeverity: RaftSeverityBreakdown[];
  topEndpoints: RaftEndpointBreakdown[];
  apps: string[];
  environments: string[];
}

export interface RaftErrorGroupsResponse {
  groups: RaftErrorGroup[];
  total: number;
  page: number;
  pageSize: number;
}

export interface RaftErrorsResponse {
  errors: RaftError[];
  total: number;
  page: number;
  pageSize: number;
}
