export interface CampaignEmailProps {
  subject: string;
  body: string;
}

export interface ExecWelcomeEmailProps {
  termLabel: string;
  when2MeetLink: string;
  discordLink: string;
}

export type MembershipReceiptNoticeKind = "welcome" | "failure" | "already_verified";

export interface MembershipReceiptProps {
  kind: MembershipReceiptNoticeKind;
}

export type MarketingSegmentBroadcastResult = {
  id?: string;
  recipientEmails: string[];
};

export type SendMarketingSegmentBroadcastParams = {
  subject: string;
  emailHtml: string;
  recipientEmails: string[];
  onEmptyRecipients: "throw" | "skip";
  emptyRecipientsMessage?: string;
};
