import type { RecruitingCapabilities } from "./capabilities";

/**
 * Whether the viewer can edit questions on a position (null = General). Presidents edit
 * everything. VPs edit their own subteam's exec positions; General questions and VP
 * seats opened to the public are presidents-only.
 */
export function canEditQuestionsFor(
  capabilities: Pick<RecruitingCapabilities, "can" | "viewer">,
  position: { subteamId: number | null; isVp: boolean } | null
): boolean {
  const scope = capabilities.can.editQuestions;
  if (scope === "all") return true;
  if (scope !== "own" || position === null || position.isVp) return false;
  return position.subteamId !== null && position.subteamId === capabilities.viewer.subteamId;
}
