export interface CampaignEmailProps {
  subject: string;
  body: string;
}

export interface ExecWelcomeEmailProps {
  termLabel: string;
  when2MeetLink: string;
  discordLink: string;
}

export interface HiringDecisionEmailProps {
  type: "offer" | "rejection";
  applicantName: string;
  positionName: string;
  offerTermLabel?: string;
  offerAcceptByDateLabel?: string;
}

export interface MembershipReceiptProps {
  success: boolean;
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
