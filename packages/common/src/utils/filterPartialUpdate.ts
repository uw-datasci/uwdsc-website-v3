/**
 * Filters a partial update object to only include defined values for allowed keys.
 * Useful for building PATCH payloads where only specified fields should be updated.
 *
 * @param data - Partial object with fields to potentially update
 * @param allowedColumns - Keys that are permitted for the update
 * @returns Filtered data and column names for the update
 */
export function filterPartialUpdate<T extends Record<string, unknown>>(
  data: T,
  allowedColumns: readonly string[],
): {
  filteredData: Record<string, string | boolean | null>;
  columns: string[];
} {
  const entries = Object.entries(data).filter(
    ([key, value]) => value !== undefined && allowedColumns.includes(key),
  );

  const filteredData = Object.fromEntries(entries) as Record<
    string,
    string | boolean | null
  >;
  const columns = entries.map(([k]) => k);

  return { filteredData, columns };
}
