import type { BoardCard, LeadershipPerson, RoleState } from "@uwdsc/common/types";
import type { BoardFilters } from "@/types/recruiting";

export function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  return (
    (parts[0]?.[0] ?? "") + (parts.length > 1 ? (parts.at(-1)?.[0] ?? "") : "")
  ).toUpperCase();
}

/** "President", "VP, Events", "Exec, Design", "Alum", … */
export function roleLabel(state: RoleState, subteamNames: ReadonlyMap<number, string>): string {
  const subteam = state.subteamId === null ? null : subteamNames.get(state.subteamId);
  switch (state.role) {
    case "pres":
      return "President";
    case "admin":
      return subteam ? `VP, ${subteam}` : "VP";
    case "exec":
      return subteam ? `Exec, ${subteam}` : "Exec";
    case "alum":
      return "Alum";
    default:
      return "Member";
  }
}

export function personNow(
  person: LeadershipPerson | undefined,
  subteamNames: ReadonlyMap<number, string>
): string {
  if (!person) return "";
  if (person.role === "exec" && person.positionName) return person.positionName;
  return roleLabel({ role: person.role, subteamId: person.subteamId }, subteamNames);
}

/** Choice rank label: 1 → "1st". Applicants pick at most three. */
export function ordinal(n: number): string {
  return ["1st", "2nd", "3rd"][n - 1] ?? `${n}th`;
}

/** "Computer Science · 3A" */
export function programLine(card: Pick<BoardCard, "program" | "year">): string {
  return [card.program, card.year].filter(Boolean).join(" · ");
}

export function matchesFilters(
  card: BoardCard,
  filters: BoardFilters,
  viewerSubteamId: number | null
): boolean {
  if (filters.mine && !(card.canMove && card.subteamId === viewerSubteamId)) return false;
  if (filters.positionId !== null && card.positionId !== filters.positionId) return false;
  if (filters.subteamId !== null && card.subteamId !== filters.subteamId) return false;
  if (filters.source === "new" && card.returning) return false;
  if (filters.source === "returning" && !card.returning) return false;
  if (filters.hasNotes && card.noteCount === 0) return false;

  const query = filters.search.trim().toLowerCase();
  if (!query) return true;
  return [card.name, card.program, card.email].some((field) =>
    field?.toLowerCase().includes(query)
  );
}

/** Cards grouped by application, for "other choices" chips and conflict badges. */
export function cardsByApplication(cards: readonly BoardCard[]): Map<string, BoardCard[]> {
  const groups = new Map<string, BoardCard[]>();
  for (const card of cards) {
    const group = groups.get(card.applicationId);
    if (group) group.push(card);
    else groups.set(card.applicationId, [card]);
  }
  for (const group of groups.values()) group.sort((a, b) => a.priority - b.priority);
  return groups;
}

/** Applicants often paste links without a scheme ("github.com/me"). */
export function externalUrl(url: string): string {
  return /^https?:\/\//i.test(url) ? url : `https://${url}`;
}

/** "Today, 10:02 AM" or "Oct 9, 3:40 PM". */
export function formatActivityTime(iso: string, now = new Date()): string {
  const date = new Date(iso);
  const time = date.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });
  if (date.toDateString() === now.toDateString()) return `Today, ${time}`;
  const day = date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    ...(date.getFullYear() === now.getFullYear() ? {} : { year: "numeric" }),
  });
  return `${day}, ${time}`;
}

/** "5h left" / "40m left" until an offer's deadline, and how much of the window is left. */
export function offerTimeLeft(
  expiresAt: string,
  windowHours: number,
  now: number
): { label: string; fraction: number; urgent: boolean } {
  const ms = new Date(expiresAt).getTime() - now;
  const hours = ms / 3_600_000;
  const label =
    hours >= 1 ? `${Math.floor(hours)}h left` : `${Math.max(1, Math.round(ms / 60_000))}m left`;
  return {
    label,
    fraction: Math.min(1, Math.max(0, hours / windowHours)),
    urgent: hours < 12,
  };
}
