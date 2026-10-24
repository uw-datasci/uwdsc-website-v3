import type { RecruitingCapabilities } from "./capabilities";
import type { SelectionStatus } from "./status";

/**
 * Whether the viewer can move a card on a position. Presidents move everything. VPs
 * move their own subteam's exec positions; applicants for public VP seats are
 * presidents-only.
 */
export function canMoveCard(
  capabilities: Pick<RecruitingCapabilities, "can" | "viewer">,
  position: { subteamId: number | null; isVp: boolean }
): boolean {
  const scope = capabilities.can.moveStatuses;
  if (scope === "all") return true;
  if (scope !== "own" || position.isVp) return false;
  return position.subteamId !== null && position.subteamId === capabilities.viewer.subteamId;
}

/** Distinct subteams that marked one candidate Wanted. Two or more is a conflict. */
export function wantedSubteams(
  cards: ReadonlyArray<{ status: SelectionStatus; subteamName: string | null }>
): string[] {
  const names = cards
    .filter((card) => card.status === "Wanted")
    .map((card) => card.subteamName ?? "Presidents");
  return [...new Set(names)];
}
