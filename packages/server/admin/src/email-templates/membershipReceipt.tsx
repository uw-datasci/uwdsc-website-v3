import {
  Body,
  Container,
  Head,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import type { ReactElement } from "react";

const SUBJECT_SUCCESS = "Welcome to UWDSC";
const SUBJECT_FAILURE = "We couldn't confirm your membership yet";

export function getMembershipReceiptSubject(success: boolean): string {
  return success ? SUBJECT_SUCCESS : SUBJECT_FAILURE;
}

interface MembershipReceiptProps {
  success: boolean;
}

export function MembershipReceipt({
  success,
}: Readonly<MembershipReceiptProps>): ReactElement {
  const subject = getMembershipReceiptSubject(success);

  const bodyTextStyle = {
    color: "#374151",
    lineHeight: "1.6" as const,
    margin: "0 0 16px 0",
    fontSize: "16px",
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
            <Text
              style={{
                fontSize: "20px",
                fontWeight: "bold",
                color: "#1a1a2e",
                margin: "0 0 2px 0",
              }}
            >
              UWDSC
            </Text>
            <Text
              style={{
                fontSize: "12px",
                color: "#6b7280",
                margin: "0 0 24px 0",
              }}
            >
              University of Waterloo Data Science Club
            </Text>
          </Section>

          <Hr style={{ borderColor: "#e6ebf1", margin: "0 0 24px 0" }} />

          <Section>
            {success ? (
              <>
                <Text style={bodyTextStyle}>
                  <strong>Welcome to the club!</strong> We've received your WUSA
                  payment and your <strong>UW Data Science Club</strong>{" "}
                  membership is now active for this term.
                </Text>
                <Text style={{ ...bodyTextStyle, marginBottom: 0 }}>
                  Thanks for joining us — we're glad you're here. Keep an eye on
                  our events and Discord; we'll see you soon.
                </Text>
              </>
            ) : (
              <>
                <Text style={bodyTextStyle}>
                  We weren't able to confirm your membership from this message
                  automatically.
                </Text>
                <Text style={{ ...bodyTextStyle, marginBottom: 0 }}>
                  Please <strong>try forwarding your receipt again</strong> in a
                  little while, or email us at{" "}
                  <Link
                    href="mailto:contact@uwdatascience.ca"
                    style={{ color: "#6366f1" }}
                  >
                    contact@uwdatascience.ca
                  </Link>{" "}
                  and we'll help you sort it out.
                </Text>
              </>
            )}
          </Section>

          <Hr style={{ borderColor: "#e6ebf1", margin: "24px 0" }} />

          <Section>
            <Text
              style={{
                fontSize: "12px",
                color: "#9ca3af",
                textAlign: "center",
                margin: "0",
              }}
            >
              University of Waterloo Data Science Club &mdash; uwdsc.ca
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}
