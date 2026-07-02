import { BaseRepository } from "@uwdsc/db/base.repository";
import type {
  RaftAppBreakdown,
  RaftEndpointBreakdown,
  RaftError,
  RaftErrorGroup,
  RaftFilters,
  RaftGroupFilters,
  RaftSeverity,
  RaftSeverityBreakdown,
  RaftStats,
  RaftTimeRange,
  RaftTimeSeriesPoint,
} from "@uwdsc/common/types";

const ENDPOINT_EXPR = `COALESCE(metadata->>'route', metadata->>'url', 'unknown')`;

type SqlFragment = ReturnType<BaseRepository["sql"]>;

function timeRangeInterval(timeRange: RaftTimeRange): string {
  switch (timeRange) {
    case "24h":
      return "24 hours";
    case "7d":
      return "7 days";
    case "30d":
      return "30 days";
    default: {
      const _exhaustive: never = timeRange;
      return _exhaustive;
    }
  }
}

function timeBucketExpr(timeRange: RaftTimeRange): string {
  return timeRange === "24h"
    ? "date_trunc('hour', created_at)"
    : "date_trunc('day', created_at)";
}

export class RaftRepository extends BaseRepository {
  private buildFilterFragments(filters: RaftFilters): SqlFragment[] {
    const fragments: SqlFragment[] = [];
    const timeRange = filters.timeRange ?? "7d";

    const interval = `INTERVAL '${timeRangeInterval(timeRange)}'`;
    fragments.push(this.sql`created_at >= NOW() - ${this.sql.unsafe(interval)}`);

    if (filters.appName) fragments.push(this.sql`app_name = ${filters.appName}`);

    if (filters.environment) fragments.push(this.sql`environment = ${filters.environment}`);

    if (filters.severity) fragments.push(this.sql`severity = ${filters.severity}`);

    if (filters.resolved === "open") {
      fragments.push(this.sql`resolved = FALSE`);
    } else if (filters.resolved === "resolved") {
      fragments.push(this.sql`resolved = TRUE`);
    }

    return fragments;
  }

  private combineFragments(fragments: SqlFragment[]): SqlFragment {
    if (fragments.length === 0) return this.sql`TRUE`;

    let combined = fragments[0]!;
    for (const fragment of fragments.slice(1)) combined = this.sql`${combined} AND ${fragment}`;

    return combined;
  }

  async getStats(filters: RaftFilters): Promise<RaftStats> {
    const where = this.combineFragments(this.buildFilterFragments(filters));

    const [row] = await this.sql<
      {
        total_errors: number;
        open_errors: number;
        critical_errors: number;
        distinct_apps: number;
      }[]
    >`
      SELECT
        COUNT(*)::int AS total_errors,
        COUNT(*) FILTER (WHERE resolved = FALSE)::int AS open_errors,
        COUNT(*) FILTER (WHERE severity IN ('error', 'fatal'))::int AS critical_errors,
        COUNT(DISTINCT app_name)::int AS distinct_apps
      FROM raft.error_quarantine
      WHERE ${where}
    `;

    return (
      row ?? {
        total_errors: 0,
        open_errors: 0,
        critical_errors: 0,
        distinct_apps: 0,
      }
    );
  }

  async getTimeSeries(filters: RaftFilters): Promise<RaftTimeSeriesPoint[]> {
    const timeRange = filters.timeRange ?? "7d";
    const where = this.combineFragments(this.buildFilterFragments(filters));
    const bucketExpr = timeBucketExpr(timeRange);

    const rows = await this.sql<
      {
        bucket: Date;
        debug: number;
        info: number;
        warning: number;
        error: number;
        fatal: number;
        total: number;
      }[]
    >`
      SELECT
        ${this.sql.unsafe(bucketExpr)} AS bucket,
        COUNT(*) FILTER (WHERE severity = 'debug')::int AS debug,
        COUNT(*) FILTER (WHERE severity = 'info')::int AS info,
        COUNT(*) FILTER (WHERE severity = 'warning')::int AS warning,
        COUNT(*) FILTER (WHERE severity = 'error')::int AS error,
        COUNT(*) FILTER (WHERE severity = 'fatal')::int AS fatal,
        COUNT(*)::int AS total
      FROM raft.error_quarantine
      WHERE ${where}
      GROUP BY bucket
      ORDER BY bucket ASC
    `;

    return rows.map((row) => ({
      bucket: row.bucket.toISOString(),
      debug: row.debug,
      info: row.info,
      warning: row.warning,
      error: row.error,
      fatal: row.fatal,
      total: row.total,
    }));
  }

  async getByApp(filters: RaftFilters): Promise<RaftAppBreakdown[]> {
    const where = this.combineFragments(this.buildFilterFragments(filters));

    return this.sql<RaftAppBreakdown[]>`
      SELECT app_name, COUNT(*)::int AS count
      FROM raft.error_quarantine
      WHERE ${where}
      GROUP BY app_name
      ORDER BY count DESC, app_name ASC
    `;
  }

  async getBySeverity(filters: RaftFilters): Promise<RaftSeverityBreakdown[]> {
    const where = this.combineFragments(this.buildFilterFragments(filters));

    return this.sql<RaftSeverityBreakdown[]>`
      SELECT severity, COUNT(*)::int AS count
      FROM raft.error_quarantine
      WHERE ${where}
      GROUP BY severity
      ORDER BY
        CASE severity
          WHEN 'fatal' THEN 1
          WHEN 'error' THEN 2
          WHEN 'warning' THEN 3
          WHEN 'info' THEN 4
          WHEN 'debug' THEN 5
          ELSE 6
        END
    `;
  }

  async getTopEndpoints(filters: RaftFilters, limit = 10): Promise<RaftEndpointBreakdown[]> {
    const where = this.combineFragments(this.buildFilterFragments(filters));

    return this.sql<RaftEndpointBreakdown[]>`
      SELECT
        ${this.sql.unsafe(ENDPOINT_EXPR)} AS endpoint,
        COUNT(*)::int AS count
      FROM raft.error_quarantine
      WHERE ${where}
      GROUP BY endpoint
      ORDER BY count DESC, endpoint ASC
      LIMIT ${limit}
    `;
  }

  async getDistinctApps(): Promise<string[]> {
    const rows = await this.sql<{ app_name: string }[]>`
      SELECT DISTINCT app_name
      FROM raft.error_quarantine
      ORDER BY app_name ASC
    `;

    return rows.map((row) => row.app_name);
  }

  async getDistinctEnvironments(): Promise<string[]> {
    const rows = await this.sql<{ environment: string }[]>`
      SELECT DISTINCT environment
      FROM raft.error_quarantine
      ORDER BY environment ASC
    `;

    return rows.map((row) => row.environment);
  }

  async getErrorGroups(filters: RaftGroupFilters): Promise<{
    groups: RaftErrorGroup[];
    total: number;
  }> {
    const page = filters.page ?? 1;
    const pageSize = filters.pageSize ?? 20;
    const offset = (page - 1) * pageSize;
    const where = this.combineFragments(this.buildFilterFragments(filters));

    const [countRow] = await this.sql<{ total: number }[]>`
      SELECT COUNT(*)::int AS total
      FROM (
        SELECT 1
        FROM raft.error_quarantine
        WHERE ${where}
        GROUP BY app_name, ${this.sql.unsafe(ENDPOINT_EXPR)}, error_message
      ) grouped
    `;

    const groups = await this.sql<RaftErrorGroup[]>`
      SELECT
        app_name,
        ${this.sql.unsafe(ENDPOINT_EXPR)} AS endpoint,
        error_message,
        COUNT(*)::int AS count,
        MIN(created_at) AS first_seen,
        MAX(created_at) AS last_seen,
        (ARRAY_AGG(severity ORDER BY created_at DESC))[1] AS latest_severity,
        COUNT(*) FILTER (WHERE resolved = TRUE)::int AS resolved_count,
        (ARRAY_AGG(id ORDER BY created_at DESC))[1] AS latest_id
      FROM raft.error_quarantine
      WHERE ${where}
      GROUP BY app_name, endpoint, error_message
      ORDER BY last_seen DESC
      LIMIT ${pageSize}
      OFFSET ${offset}
    `;

    return {
      groups: groups.map((group) => ({
        ...group,
        first_seen: new Date(group.first_seen).toISOString(),
        last_seen: new Date(group.last_seen).toISOString(),
        latest_severity: group.latest_severity as RaftSeverity,
      })),
      total: countRow?.total ?? 0,
    };
  }

  async getOccurrences(filters: RaftGroupFilters): Promise<{
    errors: RaftError[];
    total: number;
  }> {
    const page = filters.page ?? 1;
    const pageSize = filters.pageSize ?? 20;
    const offset = (page - 1) * pageSize;
    const fragments = this.buildFilterFragments(filters);

    if (filters.endpoint) {
      fragments.push(this.sql`${this.sql.unsafe(ENDPOINT_EXPR)} = ${filters.endpoint}`);
    }
    if (filters.errorMessage) {
      fragments.push(this.sql`error_message = ${filters.errorMessage}`);
    }

    const where = this.combineFragments(fragments);

    const [countRow] = await this.sql<{ total: number }[]>`
      SELECT COUNT(*)::int AS total
      FROM raft.error_quarantine
      WHERE ${where}
    `;

    const errors = await this.sql<RaftError[]>`
      SELECT
        id,
        app_name,
        environment,
        error_message,
        stack_trace,
        severity,
        metadata,
        resolved,
        created_at
      FROM raft.error_quarantine
      WHERE ${where}
      ORDER BY created_at DESC
      LIMIT ${pageSize}
      OFFSET ${offset}
    `;

    return {
      errors: errors.map((error) => ({
        ...error,
        severity: error.severity as RaftSeverity,
        metadata: (error.metadata ?? {}) as RaftError["metadata"],
        created_at: new Date(error.created_at).toISOString(),
      })),
      total: countRow?.total ?? 0,
    };
  }

  async getErrorById(id: string): Promise<RaftError | null> {
    const [error] = await this.sql<RaftError[]>`
      SELECT
        id,
        app_name,
        environment,
        error_message,
        stack_trace,
        severity,
        metadata,
        resolved,
        created_at
      FROM raft.error_quarantine
      WHERE id = ${id}
    `;

    if (!error) return null;

    return {
      ...error,
      severity: error.severity as RaftSeverity,
      metadata: (error.metadata ?? {}) as RaftError["metadata"],
      created_at: new Date(error.created_at).toISOString(),
    };
  }

  async setResolved(id: string, resolved: boolean): Promise<RaftError | null> {
    const [error] = await this.sql<RaftError[]>`
      UPDATE raft.error_quarantine
      SET resolved = ${resolved}
      WHERE id = ${id}
      RETURNING
        id,
        app_name,
        environment,
        error_message,
        stack_trace,
        severity,
        metadata,
        resolved,
        created_at
    `;

    if (!error) return null;

    return {
      ...error,
      severity: error.severity as RaftSeverity,
      metadata: (error.metadata ?? {}) as RaftError["metadata"],
      created_at: new Date(error.created_at).toISOString(),
    };
  }
}
