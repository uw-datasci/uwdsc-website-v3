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

export function getExecWelcomeSubject(termLabel: string): string {
  return `Welcome to the ${termLabel} DSC Exec Team!`;
}

export interface ExecWelcomeEmailProps {
  termLabel: string;
  when2MeetLink: string;
  discordLink: string;
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
  fontWeight: 600 as const,
};

const listItemStyle = {
  ...bodyTextStyle,
  margin: "0 0 8px 0",
};

const nestedListItemStyle = {
  ...bodyTextStyle,
  margin: "0 0 8px 0",
  paddingLeft: "20px",
};

export function ExecWelcomeEmail({
  termLabel,
  when2MeetLink,
  discordLink,
}: Readonly<ExecWelcomeEmailProps>): ReactElement {
  const subject = getExecWelcomeSubject(termLabel);

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
            <Text style={bodyTextStyle}>
              We are thrilled to welcome you to the {termLabel} DSC Exec Team!
            </Text>

            <Text style={bodyTextStyle}>
              Here are the <strong>mandatory action items</strong> to complete
              within the next 24-48 hours:
            </Text>

            <Text style={listItemStyle}>
              •{" "}
              <Link
                href={"https://admin.uwdatascience.ca/onboarding"}
                style={linkStyle}
              >
                Exec Onboarding Form
              </Link>
            </Text>
            <Text style={listItemStyle}>
              • Fill out the DSC All-Hands Team Meeting When2Meet:{" "}
              <Link href={when2MeetLink} style={linkStyle}>
                DSC First Team All-Hands! - When2meet
              </Link>
            </Text>
            <Text style={listItemStyle}>
              • Join our Exec server as our main communication will be on here:{" "}
              <Link href={discordLink} style={linkStyle}>
                Discord Server
              </Link>
            </Text>

            <Text style={{ ...bodyTextStyle, marginTop: "24px" }}>
              Please also complete the following action items as soon as
              possible:
            </Text>

            <Text style={listItemStyle}>• Membership Sign-Ups</Text>
            <Text style={nestedListItemStyle}>
              ◦ To sign-up, please make sure you have an account and are able to
              log in on{" "}
              <Link href={"https://www.uwdatascience.ca"} style={linkStyle}>
                https://www.uwdatascience.ca
              </Link>
            </Text>
            <Text style={nestedListItemStyle}>
              ◦ Please pay the $4 DSC membership fee - you must pay the fee to
              be an exec
            </Text>

            <Text style={{ ...bodyTextStyle, marginTop: "24px" }}>
              Let us know if you have any questions! Can&apos;t wait for an
              amazing term 😁
            </Text>

            <Text style={bodyTextStyle}>Best,</Text>
            <Text style={{ ...bodyTextStyle, marginBottom: "4px" }}>
              <strong>
                <em>Co-Presidents</em>
              </strong>
            </Text>
            <Text style={{ ...bodyTextStyle, marginTop: "0" }}>
              UW Data Science Club
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}
