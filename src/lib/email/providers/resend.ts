import { Resend } from "resend";

if (!process.env.RESEND_API_KEY) {
  console.warn("RESEND_API_KEY is not set. Emails will not be sent.");
}

export const resend = new Resend(process.env.RESEND_API_KEY || "dummy_key");

export const SENDER_EMAIL = process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev";
