/**
 * Fields required before a user can use main-site features (matches web middleware).
 */
export type ProfileCompletionFields = {
  first_name: string | null;
  last_name: string | null;
  wat_iam: string | null;
  faculty: string | null;
  term: string | null;
  heard_from_where: string | null;
};

/**
 * Whether onboarding profile fields are filled (same rules as web app middleware).
 */
export function isProfileComplete(row: ProfileCompletionFields | null | undefined): boolean {
  if (!row) return false;
  return !!(
    row.first_name &&
    row.last_name &&
    row.wat_iam &&
    row.faculty &&
    row.term &&
    row.heard_from_where
  );
}
