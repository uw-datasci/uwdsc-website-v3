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

export interface OfferEmailProps {
  firstName: string;
  positionName: string;
  subteamName: string | null;
  termLabel: string;
  /** Formatted, e.g. "Monday, Oct 12 at 4:00 PM ET". */
  deadline: string;
  personalLine?: string;
  /** "Ethan Liu and Aisha Rahman" */
  signedBy: string;
}

export interface RejectionEmailProps {
  firstName: string;
  termLabel: string;
  signedBy: string;
}

export interface RecruitingEmail {
  to: string;
  replyTo: string[];
  subject: string;
  html: string;
}

export interface OfferClosedEmailProps {
  firstName: string;
  positionName: string;
  termLabel: string;
  signedBy: string;
}
