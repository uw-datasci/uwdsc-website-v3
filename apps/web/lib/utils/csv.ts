/**
 * =============================================================================
 * Internal helpers
 * =============================================================================
 */

/**
 * Converts a value to a string suitable for a CSV cell.
 * Handles null/undefined, objects (JSON), and primitives.
 */
function valueToCsvCell(value: unknown): string {
  if (value === null || value === undefined) return "";
  if (typeof value === "object") return JSON.stringify(value);
  return String(value as string | number | boolean);
}

/**
 * Escapes a string for CSV: wraps in double quotes and escapes internal quotes if needed.
 */
function escapeCsvCell(str: string): string {
  return str.includes(",") || str.includes('"')
    ? `"${str.replaceAll('"', '""')}"`
    : str;
}

/**
 * Builds a CSV string from tabular data.
 * @param headers - Column headers
 * @param getValue - Function to get the value for each (row, headerKey)
 */
function buildCsv<T>(
  data: T[],
  headers: string[],
  getValue: (row: T, key: string) => unknown,
): string {
  const rows = data.map((row) =>
    headers
      .map((key) => escapeCsvCell(valueToCsvCell(getValue(row, key))))
      .join(","),
  );
  return [headers.join(","), ...rows].join("\n");
}

/**
 * Triggers a file download of the given CSV content.
 */
function downloadCsv(csvContent: string, filename: string): void {
  const blob = new Blob([csvContent], {
    type: "text/csv;charset=utf-8;",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename.endsWith(".csv") ? filename : `${filename}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

/**
 * =============================================================================
 * Exported utility functions
 * =============================================================================
 */

interface ExportToCsvConfig<T> {
  headers: string[];
  getValue: (row: T, key: string) => unknown;
}

/**
 * Builds CSV from data and triggers a download.
 */
export function exportToCsv<T>(
  data: T[],
  config: ExportToCsvConfig<T>,
  filename: string,
): void {
  const csv = buildCsv(data, config.headers, config.getValue);
  downloadCsv(csv, filename);
}
