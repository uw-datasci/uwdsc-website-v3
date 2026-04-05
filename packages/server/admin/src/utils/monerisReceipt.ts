import { DateTime } from "luxon";
import { ApiError } from "@uwdsc/common/types";

/**
 * Outlook-style inner receipt: after Moneris `From:`, capture `Sent: Monday, January 5, 2026 12:38 PM`.
 */
export const MONERIS_SENT_LINE =
  /From:\s*WUSA'S ONLINE SHOP\s*<receipt@moneris\.com>[\s\S]{0,1200}?Sent:\s*([^\r\n]+)/i;

const MONERIS_SENT_FORMAT = "EEEE, MMMM d, yyyy h:mm a";

export function parseReceiptDate(sentLine: string): Date {
  const trimmed = sentLine.trim();
  const dt = DateTime.fromFormat(trimmed, MONERIS_SENT_FORMAT, {
    zone: "America/Toronto",
  });

  if (!dt.isValid) throw new ApiError("Could not parse original receipt Sent time", 400);
  return dt.toJSDate();
}
