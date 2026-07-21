import { BaseRepository } from "@uwdsc/db/base.repository";
import type {
  SupportTicket,
  TicketFilters,
  TicketSource,
  TicketStats,
  TicketTimeSeriesPoint,
} from "@uwdsc/common/types";

type SqlFragment = ReturnType<BaseRepository["sql"]>;

interface TicketRow {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  source: TicketSource;
  created_at: Date;
}

function toSupportTicket(row: TicketRow): SupportTicket {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    subject: row.subject,
    message: row.message,
    source: row.source,
    createdAt: new Date(row.created_at).toISOString(),
  };
}

export class TicketRepository extends BaseRepository {
  private buildFilterFragments(filters: TicketFilters): SqlFragment[] {
    const fragments: SqlFragment[] = [];

    if (filters.source) fragments.push(this.sql`source = ${filters.source}`);

    if (filters.search) {
      const term = `%${filters.search}%`;
      fragments.push(
        this.sql`(name ILIKE ${term} OR email ILIKE ${term} OR subject ILIKE ${term})`,
      );
    }

    return fragments;
  }

  private combineFragments(fragments: SqlFragment[]): SqlFragment {
    if (fragments.length === 0) return this.sql`TRUE`;

    let combined = fragments[0]!;
    for (const fragment of fragments.slice(1)) combined = this.sql`${combined} AND ${fragment}`;

    return combined;
  }

  async getStats(filters: TicketFilters): Promise<TicketStats> {
    const where = this.combineFragments(this.buildFilterFragments(filters));

    const [row] = await this.sql<
      {
        total: number;
        contact_form_count: number;
        email_count: number;
        last_7_days: number;
      }[]
    >`
      SELECT
        COUNT(*)::int AS total,
        COUNT(*) FILTER (WHERE source = 'contact_form')::int AS contact_form_count,
        COUNT(*) FILTER (WHERE source = 'email')::int AS email_count,
        COUNT(*) FILTER (WHERE created_at >= NOW() - INTERVAL '7 days')::int AS last_7_days
      FROM public.contact_submissions
      WHERE ${where}
    `;

    return {
      total: row?.total ?? 0,
      contactFormCount: row?.contact_form_count ?? 0,
      emailCount: row?.email_count ?? 0,
      last7Days: row?.last_7_days ?? 0,
    };
  }

  async getTimeSeries(filters: TicketFilters): Promise<TicketTimeSeriesPoint[]> {
    const where = this.combineFragments(this.buildFilterFragments(filters));

    const rows = await this.sql<
      { date: Date; contact_form: number; email: number }[]
    >`
      SELECT
        d.day AS date,
        COUNT(*) FILTER (WHERE cs.source = 'contact_form')::int AS contact_form,
        COUNT(*) FILTER (WHERE cs.source = 'email')::int AS email
      FROM generate_series(
        date_trunc('day', NOW() - INTERVAL '29 days'),
        date_trunc('day', NOW()),
        INTERVAL '1 day'
      ) AS d(day)
      LEFT JOIN public.contact_submissions cs
        ON date_trunc('day', cs.created_at) = d.day AND ${where}
      GROUP BY d.day
      ORDER BY d.day ASC
    `;

    return rows.map((row) => ({
      date: row.date.toISOString(),
      contactForm: row.contact_form,
      email: row.email,
    }));
  }

  async list(filters: TicketFilters): Promise<{ tickets: SupportTicket[]; total: number }> {
    const page = filters.page ?? 1;
    const pageSize = filters.pageSize ?? 20;
    const offset = (page - 1) * pageSize;
    const where = this.combineFragments(this.buildFilterFragments(filters));

    const [countRow] = await this.sql<{ total: number }[]>`
      SELECT COUNT(*)::int AS total
      FROM public.contact_submissions
      WHERE ${where}
    `;

    const rows = await this.sql<TicketRow[]>`
      SELECT id, name, email, subject, message, source, created_at
      FROM public.contact_submissions
      WHERE ${where}
      ORDER BY created_at DESC
      LIMIT ${pageSize}
      OFFSET ${offset}
    `;

    return {
      tickets: rows.map(toSupportTicket),
      total: countRow?.total ?? 0,
    };
  }

  async getById(id: string): Promise<SupportTicket | null> {
    const [row] = await this.sql<TicketRow[]>`
      SELECT id, name, email, subject, message, source, created_at
      FROM public.contact_submissions
      WHERE id = ${id}
    `;

    return row ? toSupportTicket(row) : null;
  }
}
