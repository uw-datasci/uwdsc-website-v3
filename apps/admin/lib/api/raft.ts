import type {
  RaftError,
  RaftErrorGroupsResponse,
  RaftErrorsResponse,
  RaftGroupFilters,
  RaftOverview,
} from "@uwdsc/common/types";
import { createApiError } from "./error";

function buildRaftQueryParams(filters: RaftGroupFilters): string {
  const params = new URLSearchParams();

  if (filters.appName) params.set("appName", filters.appName);
  if (filters.environment) params.set("environment", filters.environment);
  if (filters.severity) params.set("severity", filters.severity);
  if (filters.timeRange) params.set("timeRange", filters.timeRange);
  if (filters.resolved) params.set("resolved", filters.resolved);
  if (filters.page) params.set("page", String(filters.page));
  if (filters.pageSize) params.set("pageSize", String(filters.pageSize));
  if (filters.endpoint) params.set("endpoint", filters.endpoint);
  if (filters.errorMessage) params.set("errorMessage", filters.errorMessage);
  if (filters.mode) params.set("mode", filters.mode);

  const query = params.toString();
  return query ? `?${query}` : "";
}

export async function getRaftOverview(filters: RaftGroupFilters = {}): Promise<RaftOverview> {
  const response = await fetch(`/api/raft/overview${buildRaftQueryParams(filters)}`);
  const data = await response.json();

  if (!response.ok) throw createApiError(data, response.status);

  return data as RaftOverview;
}

export async function getRaftErrorGroups(
  filters: RaftGroupFilters = {},
): Promise<RaftErrorGroupsResponse> {
  const response = await fetch(
    `/api/raft/errors${buildRaftQueryParams({ ...filters, mode: "groups" })}`,
  );
  const data = await response.json();

  if (!response.ok) throw createApiError(data, response.status);

  return data as RaftErrorGroupsResponse;
}

export async function getRaftOccurrences(
  filters: RaftGroupFilters,
): Promise<RaftErrorsResponse> {
  const response = await fetch(
    `/api/raft/errors${buildRaftQueryParams({ ...filters, mode: "occurrences" })}`,
  );
  const data = await response.json();

  if (!response.ok) throw createApiError(data, response.status);

  return data as RaftErrorsResponse;
}

export async function getRaftError(id: string): Promise<RaftError> {
  const response = await fetch(`/api/raft/errors/${id}`);
  const data = await response.json();

  if (!response.ok) throw createApiError(data, response.status);

  return data.error as RaftError;
}

export async function setRaftErrorResolved(id: string, resolved: boolean): Promise<RaftError> {
  const response = await fetch(`/api/raft/errors/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ resolved }),
  });
  const data = await response.json();

  if (!response.ok) throw createApiError(data, response.status);

  return data.error as RaftError;
}
