export interface GitHubOrgTeam {
  slug: string;
  name: string;
}

export interface GitHubOrgTemplateRepo {
  name: string;
  description: string;
  language: string;
}

export interface FoundryLaunchPayload {
  projectName: string;
  teamAccess: string;
  subdomain: string;
  projectType: string;
  database: string;
  postgresProvider?: string;
  mongoClient?: string;
  extras: { redis: boolean; s3: boolean };
  description: string;
}
