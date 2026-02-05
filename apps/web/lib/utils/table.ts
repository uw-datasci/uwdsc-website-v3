import type { MemberProfile } from "@/types/api";

/**
 * Global filter function for membership table.
 * Filters members by name, email, or WatIAM.
 */
export function globalMembershipFilter(
  row: { original: MemberProfile },
  columnId: string,
  filterValue: string,
): boolean {
  const search = filterValue.toLowerCase();
  const name = [row.original.first_name, row.original.last_name]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
  const email = (row.original.email ?? "").toLowerCase();
  const watiam = (row.original.wat_iam ?? "").toLowerCase();
  return (
    name.includes(search) ||
    email.includes(search) ||
    watiam.includes(search)
  );
}
