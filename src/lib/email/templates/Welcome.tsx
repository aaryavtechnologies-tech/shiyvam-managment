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
  Button,
} from "@react-email/components";

interface WelcomeProps {
  name: string;
}

export const Welcome = ({ name = "User" }: WelcomeProps) => {
  return (
    <Html>
      <Head />
      <Preview>Welcome to SHIVYAM Management Services, {name}!</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={header}>
            <Text style={logo}>SHIVYAM</Text>
            <Text style={subLogo}>Management Services</Text>
          </Section>
          
          <Section style={contentBox}>
            <Heading style={heading}>Welcome aboard, {name}!</Heading>
            <Text style={text}>
              Your account has been successfully verified. We are thrilled to have you join our platform. Whether you are looking to hire top talent or find your dream job, SHIVYAM Management Services is here to help you succeed.
            </Text>
            
            <Section style={buttonContainer}>
              <Button style={button} href={process.env.NEXT_PUBLIC_APP_URL || "https://sarkarilink.com"}>
                Go to Dashboard
              </Button>
            </Section>
          </Section>
          
          <Section style={footer}>
            <Text style={footerText}>
              &copy; {new Date().getFullYear()} SHIVYAM Management Services. All rights reserved.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

export default Welcome;

// --- Styles ---
const main = {
  backgroundColor: "#f4f4f5", 
  fontFamily: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
};

const container = {
  margin: "40px auto",
  width: "460px",
  backgroundColor: "#ffffff",
  border: "2px solid #000000",
  borderRadius: "16px",
  boxShadow: "4px 4px 0px #000000", 
  overflow: "hidden",
};

const header = {
  backgroundColor: "#0B1B3D", 
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

const subLogo = {
  color: "#C5A059", 
  fontSize: "12px",
  fontWeight: "600",
  margin: "4px 0 0",
  textTransform: "uppercase" as const,
  letterSpacing: "2px",
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

const buttonContainer = {
  textAlign: "center" as const,
  marginTop: "16px",
};

const button = {
  backgroundColor: "#C5A059",
  color: "#ffffff",
  fontWeight: "800",
  padding: "12px 32px",
  borderRadius: "8px",
  border: "2px solid #000000",
  textDecoration: "none",
  display: "inline-block",
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
