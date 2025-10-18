import { Pool } from "pg";
import { Kysely } from "kysely";

/**
 * Enhanced BaseRepository with connection pooling and raw SQL capabilities
 * @template Database - Prisma/Kysely generated database type
 */
export abstract class BaseRepository<Database = any> {
  protected db: Kysely<Database>;
  protected pool: Pool;

  constructor(db: Kysely<Database>, pool: Pool) {
    this.db = db;
    this.pool = pool;
  }
}
