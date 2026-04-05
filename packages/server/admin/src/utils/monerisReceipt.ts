import { DateTime } from "luxon";
import { ApiError } from "@uwdsc/common/types";

/** Datetime string as it appears in the Moneris receipt body (`yyyy-MM-dd HH:mm:ss`). */
const DATETIME_FORMAT = "yyyy-MM-dd HH:mm:ss";

/**
 * Parses the transaction datetime from the Moneris receipt body (local shop time, America/Toronto).
 */
export function parseTransactionDate(text: string): Date {
  const trimmed = text.trim();
  const dt = DateTime.fromFormat(trimmed, DATETIME_FORMAT, { zone: "America/Toronto" });

  if (!dt.isValid) throw new ApiError("Could not parse transaction date from receipt", 400);

  return dt.toJSDate();
}
