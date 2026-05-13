import type { PublicStats } from "@/types/stats";
import { createApiError } from "./errors";

export async function getPublicStats(): Promise<PublicStats> {
  const response = await fetch("/api/stats");
  const data = (await response.json()) as PublicStats & {
    error?: string;
    message?: string;
  };

  if (!response.ok) throw createApiError(data, response.status);
  return {
    members: data.members,
    events: data.events,
  };
}
