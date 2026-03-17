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

export const PROJECT_TYPES = [
  { label: "Next.js Node Web App", value: "nextjs-node" },
  { label: "Python / FastAPI", value: "python-fastapi" },
] as const;

export const DATABASE_OPTIONS = [
  { label: "PostgreSQL (Neon)", value: "postgresql" },
  { label: "MongoDB", value: "mongodb" },
] as const;

export type ProjectTypeValue = (typeof PROJECT_TYPES)[number]["value"];
export type DatabaseValue = (typeof DATABASE_OPTIONS)[number]["value"];

// ---------------------------------------------------------------------------
// GitHub teams (fallback when API is unavailable)
// TODO: Remove once getGitHubOrgTeams API is wired up
// ---------------------------------------------------------------------------

export const GITHUB_TEAMS_FALLBACK = [
  { value: "team-frontend", label: "Frontend" },
  { value: "team-backend", label: "Backend" },
  { value: "team-infra", label: "Infrastructure" },
  { value: "team-design", label: "Design" },
  { value: "team-docs", label: "Documentation" },
] as const;

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
