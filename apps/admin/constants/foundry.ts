// ---------------------------------------------------------------------------
// Step definitions
// ---------------------------------------------------------------------------

export const FOUNDRY_STEPS = [
  { id: 1, title: "Introduction" },
  { id: 2, title: "Project Details" },
  { id: 3, title: "Tech Stack & Infrastructure" },
  { id: 4, title: "Description" },
] as const;

// ---------------------------------------------------------------------------
// Project type & database options (used by schema and form)
// ---------------------------------------------------------------------------

export const DATABASE_OPTIONS = [
  { label: "PostgreSQL", value: "postgres" },
  { label: "MongoDB", value: "mongodb" },
] as const;

export type DatabaseValue = (typeof DATABASE_OPTIONS)[number]["value"];

export const POSTGRES_PROVIDER_OPTIONS = [
  {
    value: "neon" as const,
    label: "Neon",
    description:
      "Serverless Postgres tuned for branching and scale-to-zero — best when you only need a database.",
  },
  {
    value: "supabase" as const,
    label: "Supabase",
    description:
      "Postgres plus auth, storage, and realtime — best when you want the full backend platform.",
  },
] as const;

export type PostgresProviderValue =
  (typeof POSTGRES_PROVIDER_OPTIONS)[number]["value"];

export const MONGO_CLIENT_OPTIONS = [
  {
    value: "mongodb-driver" as const,
    label: "mongodb",
    description:
      "Official node.js driver with minimal overhead - best for maximum control and raw performance.",
  },
  {
    value: "mongoose" as const,
    label: "mongoose",
    description:
      "Library with schemas, middleware, and validation - best for structure and developer experience.",
  },
] as const;

export type MongoClientValue = (typeof MONGO_CLIENT_OPTIONS)[number]["value"];

// ---------------------------------------------------------------------------
// Extras (optional add-ons)
// ---------------------------------------------------------------------------

export const EXTRAS_OPTIONS = [
  {
    name: "extras.redis" as const,
    label: "Redis",
    description: "Managed Redis instance via Upstash",
  },
  {
    name: "extras.s3" as const,
    label: "S3 Storage",
    description: "Cloudflare R2 bucket for file uploads",
  },
] as const;
