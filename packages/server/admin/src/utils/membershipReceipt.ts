import { ApiError } from "@uwdsc/common/types";
import { DateTime } from "luxon";
import type { MembershipReceiptParse } from "../types/webhook";

const DATETIME_FORMAT = "yyyy-MM-dd HH:mm:ss";
const UWATERLOO_DOMAIN = "@uwaterloo.ca";
const EMAIL_LOCAL_CHARS = "abcdefghijklmnopqrstuvwxyz0123456789._%+-";

function isEmailLocalChar(char: string): boolean {
  return char.length === 1 && EMAIL_LOCAL_CHARS.includes(char);
}

function isUwaterlooEmail(email: string): boolean {
  const lower = email.toLowerCase();
  if (!lower.endsWith(UWATERLOO_DOMAIN)) return false;

  const local = lower.slice(0, -UWATERLOO_DOMAIN.length);
  if (local.length === 0 || !isEmailLocalChar(local[0]!)) return false;

  for (const char of local) if (!isEmailLocalChar(char)) return false;

  return true;
}

function findCustIdLine(body: string): string {
  const lower = body.toLowerCase();
  const idx = lower.indexOf("cust id:");
  if (idx === -1) return "";

  const lineEnd = body.indexOf("\n", idx);
  return lineEnd === -1 ? body.slice(idx) : body.slice(idx, lineEnd);
}

function extractUwaterlooEmailFromText(text: string, searchFrom: number): string | null {
  const lower = text.toLowerCase();
  const domainIdx = lower.indexOf(UWATERLOO_DOMAIN, searchFrom);
  if (domainIdx === -1) return null;

  let start = domainIdx - 1;
  while (start >= searchFrom && isEmailLocalChar(lower[start]!)) start--;

  start++;

  const email = lower.slice(start, domainIdx + UWATERLOO_DOMAIN.length);
  return isUwaterlooEmail(email) ? email : null;
}

function extractReceiptEmail(body: string): string | null {
  const custIdLine = findCustIdLine(body);

  const plusIdx = custIdLine.indexOf("+");
  if (plusIdx !== -1) {
    const afterPlus = extractUwaterlooEmailFromText(custIdLine, plusIdx + 1);
    if (afterPlus) return afterPlus;
  }

  const lower = body.toLowerCase();
  const custIdx = lower.indexOf("cust id:");
  if (custIdx === -1) return null;

  let searchFrom = custIdx + "cust id:".length;
  while (searchFrom < body.length && /\s/.test(body[searchFrom]!)) searchFrom++;

  return extractUwaterlooEmailFromText(body, searchFrom);
}

/**
 * Extracts a normalized @uwaterloo.ca address from a Resend `from` / envelope field.
 */
export function parseUwaterlooEmailAddress(address: string): string | null {
  const trimmed = address.trim();
  let parsed = trimmed;
  const open = trimmed.indexOf("<");
  if (open !== -1) {
    const close = trimmed.indexOf(">", open + 1);
    if (close !== -1) parsed = trimmed.slice(open + 1, close).trim();
  }
  const email = parsed.toLowerCase();
  return isUwaterlooEmail(email) ? email : null;
}

/**
 * Parses the transaction datetime from the receipt body (local shop time, America/Toronto).
 */
function parseTransactionDate(text: string): Date {
  const dt = DateTime.fromFormat(text.trim(), DATETIME_FORMAT, { zone: "America/Toronto" });

  if (!dt.isValid) throw new ApiError("Could not parse transaction date from receipt", 400);

  return dt.toJSDate();
}

/**
 * Parse and structurally validate a WUSA receipt body forwarded into the membership webhook.
 * Forwarder identity is validated separately via Resend webhook `from` (see assertForwarderMatchesReceipt).
 */
export function parseMembershipReceipt(body: string): MembershipReceiptParse {
  const isFromMoneris = /WUSA'S ONLINE SHOP/i.test(body) && /receipt@moneris\.com/i.test(body);
  const isCorrectTotal = /Total:\s*\$4\.00\b/i.test(body);
  const hasCorrectItem = /UW Data Science Club Membership/i.test(body);
  const isApproved = /Transaction Approved/i.test(body);

  const receiptEmail = extractReceiptEmail(body);

  const transactionDateText = /(\d{4}-\d{2}-\d{2}\s\d{2}:\d{2}:\d{2})/.exec(body)?.[1] ?? null;

  if (
    !isFromMoneris ||
    !isCorrectTotal ||
    !hasCorrectItem ||
    !isApproved ||
    receiptEmail === null ||
    transactionDateText === null
  ) {
    return {
      ok: false,
      kind: "invalid_structure",
      receiptEmail,
    };
  }

  return {
    ok: true,
    receiptEmail,
    transactionDateText,
  };
}

export function throwIfParseFailed(parsed: MembershipReceiptParse): asserts parsed is {
  ok: true;
  receiptEmail: string;
  transactionDateText: string;
} {
  if (parsed.ok) return;

  console.error("Invalid email receipt");
  throw new ApiError("Invalid email receipt", 400);
}

/**
 * Ensures the Resend inbound sender matches the WUSA Cust ID payer (same-inbox rule).
 */
export function assertForwarderMatchesReceipt(
  forwarderFrom: string,
  receiptEmail: string
): void {
  const forwarderEmail = parseUwaterlooEmailAddress(forwarderFrom);

  if (!forwarderEmail) {
    console.error("Inbound sender is not a @uwaterloo.ca address:", forwarderFrom);
    throw new ApiError("Forwarder must use a @uwaterloo.ca address", 400);
  }

  if (forwarderEmail !== receiptEmail.toLowerCase()) {
    console.error("Forwarder does not match Cust ID contact email");
    throw new ApiError("Forwarder and receipt contact emails do not match", 400);
  }
}

/**
 * Ensures the receipt transaction time is on or after the active term start.
 */
export function assertReceiptWithinActiveTerm(
  transactionDateText: string,
  termStartDate: string | null
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
    throw new ApiError("Transaction date is before the current term started", 400);
  }
}

export function dedupeRecipients(
  forwarderEmail: string | null,
  receiptEmail: string | null
): string[] {
  const set = new Set<string>();
  if (forwarderEmail) set.add(forwarderEmail.toLowerCase());
  if (receiptEmail) set.add(receiptEmail.toLowerCase());
  return [...set];
}
