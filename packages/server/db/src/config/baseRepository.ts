import { sql, type Sql } from "./connection";

/**
 * BaseRepository with shared postgres.js connection
 */
export abstract class BaseRepository {
  protected sql: Sql = sql;
}
