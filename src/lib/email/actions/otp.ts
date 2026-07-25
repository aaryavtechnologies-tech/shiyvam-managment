"use server";

import { createClient, createAdminClient } from "@/lib/supabase/server";
import { getResendClient, getSenderEmail } from "@/lib/email/providers/resend";
import { generateOTP, hashOTP, verifyOTPHash } from "@/lib/email/otp/crypto";
import { logEmailError } from "@/lib/email/utils/logger";
import VerificationOTP from "@/lib/email/templates/VerificationOTP";
import Welcome from "@/lib/email/templates/Welcome";

const MAX_ATTEMPTS = 5;
const OTP_EXPIRATION_MINUTES = 10;
const RESEND_COOLDOWN_SECONDS = 60;

export async function sendOTP(email: string, userId: string) {
  try {
    const supabase = createAdminClient();

    // Check cooldown
    const { data: existing } = await supabase
      .from("email_verifications" as any)
      .select("created_at")
      .eq("email", email)
      .eq("verified", false)
      .order("created_at", { ascending: false })
      .limit(1)
      .single() as unknown as { data: { created_at: string } | null; error: unknown };

    if (existing) {
      const msSinceLast = Date.now() - new Date(existing.created_at).getTime();
      if (msSinceLast < RESEND_COOLDOWN_SECONDS * 1000) {
        return { success: false, error: `Please wait \${Math.ceil((RESEND_COOLDOWN_SECONDS * 1000 - msSinceLast) / 1000)}s before requesting a new code.` };
      }
    }

    // Generate and Hash OTP
    const otp = generateOTP();
    const hashed = await hashOTP(otp);
    const expiresAt = new Date(Date.now() + OTP_EXPIRATION_MINUTES * 60000).toISOString();

    // Invalidate old OTPs for this email
    await supabase.from("email_verifications" as any).delete().eq("email", email).eq("verified", false);

    // Insert new OTP
    const { error: dbError } = await supabase.from("email_verifications" as any).insert({
      user_id: userId,
      email: email,
      otp_hash: hashed,
      expires_at: expiresAt,
    });

    if (dbError) throw dbError;

    // Send Email via Resend
    const resend = getResendClient();
    const { error: resendError } = await resend.emails.send({
      from: getSenderEmail(),
      to: email,
      subject: "Your SHIVYAM Verification Code",
      react: VerificationOTP({ validationCode: otp }) as React.ReactElement,
    });

    if (resendError) {
      // Rollback the OTP insertion so the user isn't locked out by the cooldown
      await supabase.from("email_verifications" as any).delete().eq("email", email).eq("verified", false);
      throw resendError;
    }

    return { success: true };
  } catch (err: any) {
    logEmailError("sendOTP", err);
    return { success: false, error: "Failed to send verification email. Please try again later." };
  }
}

export async function verifyOTP(email: string, code: string) {
  try {
    const supabase = createAdminClient();

    const { data: record, error: fetchError } = await supabase
      .from("email_verifications" as any)
      .select("*")
      .eq("email", email)
      .eq("verified", false)
      .order("created_at", { ascending: false })
      .limit(1)
      .single() as unknown as {
        data: { id: string; user_id: string; email: string; otp_hash: string; expires_at: string; attempts: number; verified: boolean; created_at: string } | null;
        error: unknown;
      };

    if (fetchError || !record) {
      return { success: false, error: "No active verification request found." };
    }

    // Check expiration
    if (new Date(record.expires_at).getTime() < Date.now()) {
      return { success: false, error: "Verification code has expired. Please request a new one." };
    }

    // Check attempts
    if (record.attempts >= MAX_ATTEMPTS) {
      await supabase.from("email_verifications" as any).delete().eq("id", record.id);
      return { success: false, error: "Too many failed attempts. Please request a new code." };
    }

    // Validate Hash
    const isValid = await verifyOTPHash(code, record.otp_hash);

    if (!isValid) {
      // Increment attempt
      await supabase.from("email_verifications" as any).update({ attempts: record.attempts + 1 }).eq("id", record.id);
      return { success: false, error: "Invalid verification code." };
    }

    // Valid! 
    // 1. Mark as verified in our table
    await supabase.from("email_verifications" as any).update({ verified: true }).eq("id", record.id);
    
    // 2. Bypass Supabase native auth confirmation using Admin API
    const adminSupabase = createAdminClient();
    await adminSupabase.auth.admin.updateUserById(record.user_id, { email_confirm: true });
    
    // Fetch user details for the welcome email and routing
    const { data: userData } = await (supabase.from("users" as any).select("full_name, role").eq("id", record.user_id).single() as unknown as Promise<{ data: { full_name: string | null; role: string } | null; error: unknown }>);

    // 3. Send Welcome Email asynchronously (don't await it to speed up UI response)
    const resend = getResendClient();
    resend.emails.send({
      from: getSenderEmail(),
      to: email,
      subject: "Welcome to SHIVYAM!",
      react: Welcome({ name: userData?.full_name || "User" }) as React.ReactElement,
    }).catch(e => logEmailError("sendWelcomeEmail", e));

    return { success: true, role: userData?.role };
  } catch (err: any) {
    logEmailError("verifyOTP", err);
    return { success: false, error: "An unexpected error occurred during verification." };
  }
}
