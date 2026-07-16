import type { GetReceivingEmailResponseSuccess } from "resend";

export type GetReceivedEmailContentsResult =
  | { ok: true; email: GetReceivingEmailResponseSuccess }
  | {
      ok: false;
      reason: "missing_api_key" | "resend_error";
      message: string;
    };

export type MembershipReceiptParse =
  | {
      ok: true;
      receiptEmail: string;
      transactionDateText: string;
    }
  | {
      ok: false;
      kind: "invalid_structure";
      receiptEmail: string | null;
    };
