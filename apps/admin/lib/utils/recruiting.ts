import type { LeadershipPerson, RoleState } from "@uwdsc/common/types";

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
