/**
 * Roles that are allowed to access the admin app (and see the Admin nav link on the public site).
 * `alum` is intentionally excluded — alums get a narrow, single-page exception (the returning-exec
 * form) handled separately, not full admin-app access.
 */
export const ADMIN_ROLES = new Set<string>(["admin", "exec", "pres"]);

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
 * Role for former execs. Behaves like `member` everywhere except they may access the
 * returning-exec form (`RETURNING_EXEC_PATH`) in the admin app to indicate whether they
 * want to return for a future term.
 */
export const ALUM_ROLE = "alum";

export function isAlum(role?: string | null): boolean {
  return role === ALUM_ROLE;
}

/**
 * The one admin-app route an `alum` user is permitted to visit.
 */
export const RETURNING_EXEC_PATH = "/logistics/returning";
