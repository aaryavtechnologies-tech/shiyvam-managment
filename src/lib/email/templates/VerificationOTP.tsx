import * as React from "react";
import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";

interface VerificationOTPProps {
  validationCode: string;
}

export const VerificationOTP = ({ validationCode = "123456" }: VerificationOTPProps) => {
  return (
    <Html>
      <Head />
      <Preview>Your Shivyam Verification Code: {validationCode}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={header}>
            <Text style={logo}>Shivyam</Text>
          </Section>
          
          <Section style={contentBox}>
            <Heading style={heading}>Verify your email address</Heading>
            <Text style={text}>
              Welcome to Shivyam! Please enter the following 6-digit code to verify your email address and complete your registration.
            </Text>
            
            <Section style={codeBox}>
              <Text style={codeText}>{validationCode}</Text>
            </Section>
            
            <Text style={warningText}>
              This code will expire in 10 minutes. If you did not request this, you can safely ignore this email.
            </Text>
          </Section>
          
          <Section style={footer}>
            <Text style={footerText}>
              &copy; {new Date().getFullYear()} Shivyam. All rights reserved.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

export default VerificationOTP;

// --- Styles mapping to the Brutalist / Modern aesthetic ---
const main = {
  backgroundColor: "#f4f4f5", // Tailwind muted
  fontFamily: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
};

const container = {
  margin: "40px auto",
  width: "460px",
  backgroundColor: "#ffffff",
  border: "2px solid #000000",
  borderRadius: "16px",
  boxShadow: "4px 4px 0px #000000", // brutal-sm
  overflow: "hidden",
};

const header = {
  backgroundColor: "#2563eb", // Tailwind primary blue
  padding: "24px",
  textAlign: "center" as const,
  borderBottom: "2px solid #000000",
};

const logo = {
  color: "#ffffff",
  fontSize: "24px",
  fontWeight: "800",
  margin: "0",
  letterSpacing: "-0.5px",
};

const contentBox = {
  padding: "32px",
};

const heading = {
  fontSize: "24px",
  fontWeight: "800",
  color: "#000000",
  margin: "0 0 16px",
  letterSpacing: "-0.5px",
};

const text = {
  fontSize: "15px",
  color: "#3f3f46",
  lineHeight: "24px",
  margin: "0 0 24px",
};

const codeBox = {
  backgroundColor: "#f4f4f5",
  border: "2px solid #000000",
  borderRadius: "12px",
  padding: "24px",
  textAlign: "center" as const,
  marginBottom: "24px",
};

const codeText = {
  fontSize: "36px",
  fontWeight: "800",
  color: "#000000",
  letterSpacing: "8px",
  margin: "0",
};

const warningText = {
  fontSize: "13px",
  color: "#71717a",
  lineHeight: "20px",
  margin: "0",
};

const footer = {
  backgroundColor: "#f4f4f5",
  padding: "20px",
  textAlign: "center" as const,
  borderTop: "2px solid #e4e4e7",
};

const footerText = {
  fontSize: "12px",
  color: "#71717a",
  margin: "0",
};
