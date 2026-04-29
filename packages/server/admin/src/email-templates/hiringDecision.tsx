import {
  Body,
  Container,
  Head,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import type { ReactElement } from "react";

const SUBJECT_OFFER = "UWDSC - Congratulations!";
const SUBJECT_REJECTION = "UWDSC - Application Update";

/** Default hiring term copy; override via email props when sending offers for another term. */
const DEFAULT_OFFER_TERM = "Winter 2026";
/** Default reply-by date for offer acceptance. */
const DEFAULT_OFFER_ACCEPT_BY = "January 2nd";

const SOCIAL_LINKS = [
  { label: "Instagram", href: "https://www.instagram.com/uwaterloodsc/" },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/company/waterloo-data-science-club/",
  },
  { label: "Discord", href: "https://discord.gg/VFVkyP5mgm" },
  { label: "Website", href: "https://uwdsc.ca" },
] as const;

export function getHiringDecisionSubject(type: "offer" | "rejection"): string {
  return type === "offer" ? SUBJECT_OFFER : SUBJECT_REJECTION;
}

interface HiringDecisionEmailProps {
  type: "offer" | "rejection";
  applicantName: string;
  positionName: string;
  offerTermLabel?: string;
  offerAcceptByDateLabel?: string;
}

export function HiringDecisionEmail({
  type,
  applicantName,
  positionName,
  offerTermLabel = DEFAULT_OFFER_TERM,
  offerAcceptByDateLabel = DEFAULT_OFFER_ACCEPT_BY,
}: Readonly<HiringDecisionEmailProps>): ReactElement {
  const subject = getHiringDecisionSubject(type);
  const termLower = offerTermLabel.toLowerCase();
  let teamClosing = "the team";
  if (termLower.startsWith("winter") || termLower.includes(" winter")) {
    teamClosing = "the Winter team";
  } else if (termLower.startsWith("fall") || termLower.includes(" fall")) {
    teamClosing = "the Fall team";
  }

  const bodyTextStyle = {
    color: "#374151",
    lineHeight: "1.6" as const,
    margin: "0 0 16px 0",
    fontSize: "16px",
  };

  const linkStyle = {
    color: "#2563eb",
    textDecoration: "underline" as const,
  };

  return (
    <Html>
      <Head />
      <Preview>{subject}</Preview>
      <Body
        style={{
          backgroundColor: "#f6f9fc",
          fontFamily:
            "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        }}
      >
        <Container
          style={{
            maxWidth: "600px",
            margin: "40px auto",
            backgroundColor: "#ffffff",
            borderRadius: "8px",
            padding: "40px",
            border: "1px solid #e6ebf1",
          }}
        >
          <Section>
            <Text style={bodyTextStyle}>Hi {applicantName},</Text>

            {type === "offer" ? (
              <>
                <Text style={bodyTextStyle}>
                  <span
                    style={{
                      backgroundColor: "#dbeafe",
                      fontWeight: 700,
                      padding: "0 4px",
                      borderRadius: "2px",
                    }}
                  >
                    Congratulations
                  </span>
                  ! We are thrilled to have you on the Data Science Club as a{" "}
                  <strong>{positionName}</strong> for {offerTermLabel}!
                </Text>
                <Text style={bodyTextStyle}>
                  Please <strong>reply</strong> to this email if you would like
                  to accept this offer by the end of day{" "}
                  <strong>{offerAcceptByDateLabel}</strong>. If you choose to
                  accept, we will be sending the next steps shortly after
                  receiving your response.
                </Text>
                <Text style={{ ...bodyTextStyle, marginBottom: "24px" }}>
                  Excited for you to be part of {teamClosing}!
                </Text>
                <Text style={{ ...bodyTextStyle, marginBottom: "4px" }}>
                  Best,
                </Text>
                <Text
                  style={{
                    ...bodyTextStyle,
                    marginBottom: "4px",
                    fontWeight: 700,
                  }}
                >
                  Co-Presidents
                </Text>
                <Text style={{ ...bodyTextStyle, marginBottom: "28px" }}>
                  UW Data Science Club
                </Text>
                <Text
                  style={{
                    ...bodyTextStyle,
                    marginBottom: "0",
                    fontSize: "14px",
                  }}
                >
                  {SOCIAL_LINKS.map((item, index) => (
                    <span key={item.href}>
                      {index > 0 ? " | " : null}
                      <Link href={item.href} style={linkStyle}>
                        {item.label}
                      </Link>
                    </span>
                  ))}
                </Text>
              </>
            ) : (
              <>
                <Text style={bodyTextStyle}>
                  Thank you for your interest in the{" "}
                  <strong>{positionName}</strong> position with the UW Data
                  Science Club. After careful consideration, we've decided to
                  move forward with other candidates for this role.
                </Text>
                <Text style={{ ...bodyTextStyle, marginBottom: "24px" }}>
                  We truly appreciate the time you put into your application and
                  encourage you to apply again in the future. We wish you all
                  the best!
                </Text>
                <Text
                  style={{
                    ...bodyTextStyle,
                    marginBottom: "0",
                    fontSize: "12px",
                    color: "#9ca3af",
                    textAlign: "center" as const,
                  }}
                >
                  UW Data Science Club &mdash;{" "}
                  <Link
                    href="https://uwdsc.ca"
                    style={{ ...linkStyle, color: "#6b7280" }}
                  >
                    uwdsc.ca
                  </Link>
                </Text>
              </>
            )}
          </Section>
        </Container>
      </Body>
    </Html>
  );
}
