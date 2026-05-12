import type { GetReceivingEmailResponseSuccess } from "resend";

export type GetReceivedEmailContentsResult =
  | { ok: true; email: GetReceivingEmailResponseSuccess }
  | {
    ok: false;
    reason: "missing_api_key" | "resend_error" | "wrong_recipient";
    message: string;
  };

export type MembershipReceiptParse =
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
