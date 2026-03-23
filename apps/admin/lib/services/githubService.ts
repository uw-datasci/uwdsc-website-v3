interface GitHubOrgTeam {
  slug: string;
  name: string;
}

interface GitHubOrgTemplateRepo {
  name: string;
  description: string;
  language: string;
}

interface FoundryLaunchPayload {
  projectName: string;
  teamAccess: string;
  projectType: string;
  database: string;
  postgresProvider?: string;
  mongoClient?: string;
  extras: {
    redis: boolean;
    s3: boolean;
  };
  description: string;
}

const githubToken = process.env.GITHUB_TOKEN;
if (!githubToken) throw new Error("GITHUB_TOKEN is not set");

const foundryWorkflowId = process.env.FOUNDRY_WORKFLOW_ID;
if (!foundryWorkflowId) throw new Error("FOUNDRY_WORKFLOW_ID is not set");

/**
 * GitHub service for the admin app.
 * Keeps external GitHub logic out of route handlers.
 */
class GitHubService {
  private readonly org: string = "uw-datasci";
  private readonly headers: Record<string, string>;
  private readonly baseUrl: string = "https://api.github.com";
  private readonly templateTopic: string = "nexus-template";
  private readonly foundryRepo: string = "nexus-foundry";

  constructor() {
    this.headers = {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${githubToken}`,
      "X-GitHub-Api-Version": "2022-11-28",
      "User-Agent": "uwdsc-website-admin",
    };
  }

  /**
   * List teams for a GitHub organization.
   * Fetches a single page of teams (no pagination).
   */
  async getTeams(): Promise<GitHubOrgTeam[]> {
    const url = `${this.baseUrl}/orgs/${this.org}/teams`;

    try {
      const res = await fetch(url, {
        method: "GET",
        headers: this.headers,
        next: { revalidate: 300 },
      });

      if (!res.ok) {
        const body = await res.text().catch(() => "");
        throw new Error(
          `GitHub teams request failed (${res.status} ${res.statusText}) ${body}`,
        );
      }

      const data: unknown = await res.json();
      if (!Array.isArray(data) || data.length === 0) return [];

      return data
        .map((t) => {
          const team = t as {
            slug?: unknown;
            name?: unknown;
            parent?: { id?: unknown } | null;
          };
          const slug = typeof team.slug === "string" ? team.slug : "";
          const name = typeof team.name === "string" ? team.name : "";
          const hasParentId =
            team.parent != null &&
            typeof team.parent.id === "number" &&
            Number.isFinite(team.parent.id);
          return { slug, name, hasParentId };
        })
        .filter((t) => t.slug && t.name && t.hasParentId)
        .map(({ slug, name }) => ({ slug, name }));
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Unknown error";
      throw new Error(
        `GitHub teams request failed for org="${this.org}": ${message}`,
      );
    }
  }

  /**
   * Get GitHub template repositories for Foundry.
   *
   * Uses GitHub search:
   * `org:${org} + topic:nexus-template`
   */
  async getTemplates(): Promise<GitHubOrgTemplateRepo[]> {
    const query = `org:${this.org}+topic:${this.templateTopic}`;
    const url = `${this.baseUrl}/search/repositories?q=${query}`;

    try {
      const res = await fetch(url, {
        method: "GET",
        headers: this.headers,
        next: { revalidate: 300 },
      });

      if (!res.ok) {
        const body = await res.text().catch(() => "");
        throw new Error(
          `GitHub template repos request failed (${res.status} ${res.statusText}) ${body}`,
        );
      }

      const data: unknown = await res.json();
      const items = (data as { items?: unknown }).items;
      if (!Array.isArray(items) || items.length === 0) return [];

      return items
        .map((repo) => {
          const r = repo as {
            name?: unknown;
            description?: unknown;
            language?: unknown;
          };

          const name = typeof r.name === "string" ? r.name : "";
          if (!name) return null;

          return {
            name,
            description: typeof r.description === "string" ? r.description : "",
            language: typeof r.language === "string" ? r.language : "",
          };
        })
        .filter((r): r is GitHubOrgTemplateRepo => r !== null);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Unknown error";
      throw new Error(
        `GitHub template repos request failed for org="${this.org}": ${message}`,
      );
    }
  }

  /**
   * Dispatch a Foundry launch workflow in the `nexus-foundry` repository.
   *
   * If FOUNDRY_WORKFLOW_ID is provided, uses workflow dispatch with inputs.
   * Otherwise falls back to repository_dispatch with event_type=foundry-launch.
   */
  async launchFoundryProject(payload: FoundryLaunchPayload): Promise<void> {
    const repoPath = `/repos/${this.org}/${this.foundryRepo}`;

    if (foundryWorkflowId) {
      const workflowUrl = `${this.baseUrl}${repoPath}/actions/workflows/${foundryWorkflowId}/dispatches`;
      const workflowBody = {
        ref: "main",
        inputs: {
          project_name: payload.projectName,
          team_access: payload.teamAccess,
          project_type: payload.projectType,
          database: payload.database,
          postgres_provider: payload.postgresProvider ?? "",
          mongo_client: payload.mongoClient ?? "",
          redis: String(payload.extras.redis),
          s3: String(payload.extras.s3),
          description: payload.description,
        },
      };

      try {
        const res = await fetch(workflowUrl, {
          method: "POST",
          headers: this.headers,
          body: JSON.stringify(workflowBody),
        });

        if (!res.ok) {
          const body = await res.text().catch(() => "");
          throw new Error(
            `Workflow dispatch failed (${res.status} ${res.statusText}) ${body}`,
          );
        }
        return;
      } catch (error: unknown) {
        const message =
          error instanceof Error ? error.message : "Unknown error";
        throw new Error(
          `Failed to launch Foundry workflow for repo="${this.foundryRepo}": ${message}`,
        );
      }
    }

    const dispatchUrl = `${this.baseUrl}${repoPath}/dispatches`;
    const dispatchBody = {
      event_type: "foundry-launch",
      client_payload: payload,
    };

    try {
      const res = await fetch(dispatchUrl, {
        method: "POST",
        headers: this.headers,
        body: JSON.stringify(dispatchBody),
      });

      if (!res.ok) {
        const body = await res.text().catch(() => "");
        throw new Error(
          `Repository dispatch failed (${res.status} ${res.statusText}) ${body}`,
        );
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Unknown error";
      throw new Error(
        `Failed to launch Foundry dispatch for repo="${this.foundryRepo}": ${message}`,
      );
    }
  }
}

export const githubService = new GitHubService();
