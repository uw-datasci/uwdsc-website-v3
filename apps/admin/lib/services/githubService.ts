interface GitHubOrgTeam {
  slug: string;
  name: string;
}

interface GitHubOrgTemplateRepo {
  name: string;
  description: string;
  language: string;
}

const githubToken = process.env.GITHUB_TOKEN;
if (!githubToken) throw new Error("GITHUB_TOKEN is not set");

/**
 * GitHub service for the admin app.
 * Keeps external GitHub logic out of route handlers.
 */
class GitHubService {
  private readonly org: string = "uw-datasci";
  private readonly headers: Record<string, string>;
  private readonly baseUrl: string = "https://api.github.com";
  private readonly templateTopic: string = "nexus-template";

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
}

export const githubService = new GitHubService();
