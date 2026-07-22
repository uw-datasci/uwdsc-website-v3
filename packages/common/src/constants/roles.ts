/**
 * Roles that are allowed to access the admin app (and see the Admin nav link on the public site).
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
