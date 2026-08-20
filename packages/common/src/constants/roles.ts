import type { UserRole } from "../types/shared/enums";

/**
 * Roles that are allowed to access the admin app (and see the Admin nav link on the public site).
 * `alum` is intentionally excluded — alums get a narrow, single-page exception (the returning-exec
 * form) handled separately, not full admin-app access.
 */
export const ADMIN_ROLES = new Set<string>(["admin", "exec", "pres"]);

/** Canonical role enum values (DB `user_role_enum`, API, forms). */
export const ROLE_VALUES = [
  "member",
  "exec",
  "admin",
  "pres",
  "alum",
] as const satisfies readonly UserRole[];

/** Human-readable labels for each role value. */
export const ROLE_LABELS: Record<UserRole, string> = {
  member: "Member",
  exec: "Exec",
  admin: "Admin (VP)",
  pres: "President",
  alum: "Alum",
};

/** `<Select>`-ready `{ value, label }` options for the role enum. */
export const ROLE_SELECT_OPTIONS = ROLE_VALUES.map((value) => ({
  value,
  label: ROLE_LABELS[value],
}));

/**
 * Roles with full admin-portal capability. `pres` is a superset of `admin` — presidents get
 * everything the admin role unlocks, plus president-only features (see `isPresident`).
 */
export function isAdmin(role?: string | null): boolean {
  return role === "admin" || role === "pres";
}

/**
 * President access is role-driven: a user is a president iff their `user_role` is `pres`,
 * independent of their exec_team membership/position.
 */
export function isPresident(role?: string | null): boolean {
  return role === "pres";
}

/**
 * The role-related claims mirrored into Supabase `app_metadata` by the
 * `on_role_upsert` trigger on `public.user_roles`.
 *
 * `subteamId` is the subteam the user is scoped to (`user_roles.subteam_id`) and is
 * `null` for `member` and `alum`, enforced by the `user_roles_subteam_matches_role`
 * check constraint. `subteamName` is display-only — authorization always keys off the id.
 */
export interface RoleClaims {
  role: string | null;
  subteamId: number | null;
  subteamName: string | null;
}

/**
 * Read the role claims out of a Supabase user's `app_metadata`.
 *
 * Prefer this over reaching into `app_metadata` directly so every guard, route, and
 * layout parses the claims the same way.
 */
export function readRoleClaims(
  appMetadata?: Record<string, unknown> | null,
): RoleClaims {
  const role = typeof appMetadata?.role === "string" ? appMetadata.role : null;
  const rawSubteamId = appMetadata?.subteam_id;
  const subteamId =
    typeof rawSubteamId === "number" && Number.isInteger(rawSubteamId)
      ? rawSubteamId
      : null;
  const subteamName =
    typeof appMetadata?.subteam === "string" ? appMetadata.subteam : null;

  return { role, subteamId, subteamName };
}

/**
 * Role for former execs. Behaves like `member` everywhere except they may access the
 * returning-exec form (`RETURNING_EXEC_PATH`) in the admin app to indicate whether they
 * want to return for a future term.
 */
export const ALUM_ROLE = "alum";

export function isAlum(role?: string | null): boolean {
  return role === ALUM_ROLE;
}

/**
 * Roles that carry no subteam. Mirrors the `user_roles_subteam_matches_role` check
 * constraint: `member` and `alum` must have `subteam_id IS NULL`, every other role
 * must have one.
 */
export const ROLES_WITHOUT_SUBTEAM = new Set<string>(["member", ALUM_ROLE]);

/** True when the role must be paired with a subteam (`exec`, `admin`, `pres`). */
export function roleRequiresSubteam(role?: string | null): boolean {
  return Boolean(role) && !ROLES_WITHOUT_SUBTEAM.has(role as string);
}

/**
 * The one admin-app route an `alum` user is permitted to visit.
 */
export const RETURNING_EXEC_PATH = "/logistics/returning";
