import { sql, type Sql } from "@uwdsc/db";

/**
 * BaseRepository with shared postgres.js connection
 */
export abstract class BaseRepository {
  protected sql: Sql = sql;
}
