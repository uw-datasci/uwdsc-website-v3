/**
 * Normalize event description text for display and calendar exports.
 * Some records store literal escape sequences (e.g. "\\n" from JSON) instead of newlines.
 */
export function formatEventDescription(description: string): string {
  return description
    .replaceAll(String.raw`\r\n`, "\r\n")
    .replaceAll(String.raw`\n`, "\n")
    .replaceAll(String.raw`\r`, "\r")
    .replaceAll(String.raw`\t`, "\t");
}
