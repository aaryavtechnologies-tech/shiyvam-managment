import { Resend } from "resend";

export const getResendClient = () => {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  if (!apiKey) {
    console.error("RESEND_API_KEY is missing from environment variables.");
    throw new Error("RESEND_API_KEY is missing. Please add it to your Vercel Environment Variables.");
  }
  return new Resend(apiKey);
};

export const getSenderEmail = () => {
  return process.env.EMAIL_FROM || process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev";
};
