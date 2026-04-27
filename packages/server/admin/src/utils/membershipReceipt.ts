import { ApiError } from "@uwdsc/common/types";
import { DateTime } from "luxon";

const DATETIME_FORMAT = "yyyy-MM-dd HH:mm:ss";

/**
 * Parses the transaction datetime from the receipt body (local shop time, America/Toronto).
 */
function parseTransactionDate(text: string): Date {
  const dt = DateTime.fromFormat(text.trim(), DATETIME_FORMAT, {
    zone: "America/Toronto",
  });

  if (!dt.isValid)
    throw new ApiError("Could not parse transaction date from receipt", 400);

  return dt.toJSDate();
}

type MembershipReceiptParse =
  | {
      ok: true;
      toRecipientEmail: string;
      receiptEmail: string;
      transactionDateText: string;
    }
  | {
      ok: false;
      kind: "invalid_structure" | "email_mismatch";
      toRecipientEmail: string | null;
      receiptEmail: string | null;
    };

/**
 * Parse and structurally validate a WUSA receipt body forwarded into the membership webhook.
 */
export function parseMembershipReceipt(body: string): MembershipReceiptParse {
  const isFromMoneris =
    /From:\s*WUSA'S ONLINE SHOP\s*<receipt@moneris\.com>/i.test(body);
  const isCorrectTotal = /Total:\s*\$4\.00\b/i.test(body);
  const hasCorrectItem = /UW Data Science Club Membership/i.test(body);
  const isApproved = /Transaction Approved/i.test(body);

  const toWithAngle =
    /To:\s*.+?<([a-z0-9._%+-]+@uwaterloo\.ca)>/i.exec(body)?.[1] ?? null;
  const toPlain =
    /To:\s*([a-z0-9._%+-]+@uwaterloo\.ca)\b/i.exec(body)?.[1] ?? null;
  const toRecipientEmail = (toWithAngle ?? toPlain)?.toLowerCase() ?? null;

  const custIdLine = /Cust ID:[^\n]*/i.exec(body)?.[0] ?? "";
  const receiptEmailAfterPlus = /\+([a-z0-9._%+-]+@uwaterloo\.ca)/i.exec(
    custIdLine,
  )?.[1];
  const receiptEmailPlain =
    /Cust ID:\s*([a-z][a-z0-9._%+-]*@uwaterloo\.ca)/i.exec(body)?.[1] ?? null;
  const receiptEmail =
    (receiptEmailAfterPlus ?? receiptEmailPlain)?.toLowerCase() ?? null;

  const transactionDateText =
    /(\d{4}-\d{2}-\d{2}\s\d{2}:\d{2}:\d{2})/.exec(body)?.[1] ?? null;

  const structureOk =
    isFromMoneris &&
    isCorrectTotal &&
    hasCorrectItem &&
    isApproved &&
    toRecipientEmail !== null &&
    receiptEmail !== null &&
    transactionDateText !== null;

  if (!structureOk) {
    return {
      ok: false,
      kind: "invalid_structure",
      toRecipientEmail,
      receiptEmail,
    };
  }

  if (toRecipientEmail !== receiptEmail) {
    return {
      ok: false,
      kind: "email_mismatch",
      toRecipientEmail,
      receiptEmail,
    };
  }

  return {
    ok: true,
    toRecipientEmail,
    receiptEmail,
    transactionDateText,
  };
}

export function throwIfParseFailed(
  parsed: MembershipReceiptParse,
): asserts parsed is {
  ok: true;
  toRecipientEmail: string;
  receiptEmail: string;
  transactionDateText: string;
} {
  if (parsed.ok) return;

  switch (parsed.kind) {
    case "email_mismatch":
      console.error("To recipient does not match Cust ID contact email");
      throw new ApiError("Receipt To and contact emails do not match", 400);
    case "invalid_structure":
      console.error("Invalid email receipt");
      throw new ApiError("Invalid email receipt", 400);
    default: {
      const _exhaustive: never = parsed.kind;
      throw new Error(`Unhandled MembershipReceiptParse kind: ${_exhaustive}`);
    }
  }
}

/**
 * Ensures the receipt transaction time is on or after the active term start.
 */
export function assertReceiptWithinActiveTerm(
  transactionDateText: string,
  termStartDate: string | null,
): void {
  if (termStartDate === null) {
    console.error("Active term has no start date");
    throw new ApiError("Active term has no start date", 400);
  }

  const inboundAt = parseTransactionDate(transactionDateText);
  const termStartAt = new Date(termStartDate);

  if (Number.isNaN(termStartAt.getTime())) {
    console.error("Invalid term start timestamp");
    throw new ApiError("Invalid term start timestamp", 400);
  }

  if (inboundAt < termStartAt) {
    console.error("Transaction date is before the current term started");
    throw new ApiError(
      "Transaction date is before the current term started",
      400,
    );
  }
}

export function dedupeRecipients(
  toRecipientEmail: string | null,
  receiptEmail: string | null,
): string[] {
  const set = new Set<string>();
  if (toRecipientEmail) set.add(toRecipientEmail.toLowerCase());
  if (receiptEmail) set.add(receiptEmail.toLowerCase());
  return [...set];
}
