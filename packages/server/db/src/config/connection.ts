import postgres from "postgres";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) throw new Error("DATABASE_URL is not set");

/**
 * PostgreSQL connection using postgres.js optimized for Supabase Transaction Pooler
 * Shared across all repositories to prevent connection exhaustion
 */
export const sql = postgres(databaseUrl, {
  // CRITICAL: Required for Supabase Transaction Pooler (port 6543)
  // Transaction pooler doesn't support prepared statements
  prepare: false,

  // Optimized for serverless + Supabase Transaction Pooler
  max: 10, // Allow multiple concurrent queries
  idle_timeout: 20, // Seconds before idle connections are closed
  connect_timeout: 10, // Seconds to wait for connection
  max_lifetime: 60 * 30,

  // Connection options
  connection: { search_path: "public,auth" },

  // Transform options for consistent behavior
  transform: { undefined: null },

  // Error handling
  onnotice: () => {}, // Suppress notices
});

// Export type for use in repositories
export type Sql = typeof sql;
