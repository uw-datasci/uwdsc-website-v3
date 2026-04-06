import {
  Body,
  Container,
  Head,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import { Markdown } from "@react-email/markdown";
import type { ReactElement } from "react";

interface CampaignEmailProps {
  subject: string;
  body: string;
}

export function CampaignEmail({
  subject,
  body,
}: Readonly<CampaignEmailProps>): ReactElement {
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
            <Markdown
              markdownCustomStyles={{
                h1: { fontSize: "24px", fontWeight: "bold", color: "#1a1a2e" },
                h2: { fontSize: "20px", fontWeight: "600", color: "#1a1a2e" },
                h3: { fontSize: "16px", fontWeight: "600", color: "#1a1a2e" },
                p: {
                  color: "#374151",
                  lineHeight: "1.6",
                  margin: "0 0 16px 0",
                },
                link: { color: "#6366f1" },
                blockQuote: {
                  borderLeft: "4px solid #e6ebf1",
                  paddingLeft: "16px",
                  color: "#6b7280",
                },
                codeInline: {
                  backgroundColor: "#f3f4f6",
                  padding: "2px 6px",
                  borderRadius: "4px",
                  fontFamily: "monospace",
                  fontSize: "14px",
                },
              }}
            >
              {body}
            </Markdown>
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
