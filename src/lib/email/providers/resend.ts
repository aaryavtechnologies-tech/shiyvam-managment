import { Resend } from "resend";

export const getResendClient = () => {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn("RESEND_API_KEY is not set. Emails will not be sent.");
  }
  return new Resend(apiKey || "dummy_key");
};

export const getSenderEmail = () => {
  return process.env.EMAIL_FROM || process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev";
};
