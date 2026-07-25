"use server";

import { actionClient } from "@/lib/action";
import { forgotPasswordSchema, verifyOtpResetPasswordSchema } from "@/lib/validations/auth";
import { createAdminClient } from "@/lib/supabase/server";
import { AuthError } from "@/types/auth";
import { getResendClient, getSenderEmail } from "@/lib/email/providers/resend";
import { generateOTP, hashOTP, verifyOTPHash } from "@/lib/email/otp/crypto";
import { logEmailError } from "@/lib/email/utils/logger";
import ResetPasswordOTP from "@/lib/email/templates/ResetPasswordOTP";
import { logAuditAction } from "@/lib/audit";

const MAX_ATTEMPTS = 5;
const OTP_EXPIRATION_MINUTES = 10;
const RESEND_COOLDOWN_SECONDS = 60;

export const sendPasswordResetOTPAction = actionClient
  .schema(forgotPasswordSchema)
  .action(async ({ parsedInput: { email } }) => {
    try {
      const supabase = createAdminClient();

      // Ensure user exists
      const { data: userRecord, error: userError } = await supabase
        .from("users")
        .select("id")
        .eq("email", email)
        .single();

      if (userError || !userRecord) {
        // Prevent email enumeration attacks - always return success even if user doesn't exist
        return { success: true };
      }

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
          throw new AuthError(`Please wait ${Math.ceil((RESEND_COOLDOWN_SECONDS * 1000 - msSinceLast) / 1000)}s before requesting a new code.`, "cooldown");
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
        user_id: userRecord.id,
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
        subject: "Your SHIVYAM Password Reset Code",
        react: ResetPasswordOTP({ validationCode: otp }) as React.ReactElement,
      });

      if (resendError) {
        // Rollback the OTP insertion so the user isn't locked out by the cooldown
        await supabase.from("email_verifications" as any).delete().eq("email", email).eq("verified", false);
        throw resendError;
      }

      return { success: true };
    } catch (error: any) {
      if (error instanceof AuthError) throw error;
      logEmailError("sendPasswordResetOTPAction", error);
      throw new AuthError("Failed to send reset email. Please try again later.", "email_send_failed");
    }
  });

export const verifyAndResetPasswordAction = actionClient
  .schema(verifyOtpResetPasswordSchema)
  .action(async ({ parsedInput: { otp, password, email } }) => {
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
        throw new AuthError("No active password reset request found.", "not_found");
      }

      // Check expiration
      if (new Date(record.expires_at).getTime() < Date.now()) {
        throw new AuthError("Verification code has expired. Please request a new one.", "expired");
      }

      // Check attempts
      if (record.attempts >= MAX_ATTEMPTS) {
        await supabase.from("email_verifications" as any).delete().eq("id", record.id);
        throw new AuthError("Too many failed attempts. Please request a new code.", "too_many_attempts");
      }

      // Validate Hash
      const isValid = await verifyOTPHash(otp, record.otp_hash);

      if (!isValid) {
        // Increment attempt
        await supabase.from("email_verifications" as any).update({ attempts: record.attempts + 1 }).eq("id", record.id);
        throw new AuthError("Invalid verification code.", "invalid_code");
      }

      // OTP is valid!
      // Delete the OTP so it can't be reused
      await supabase.from("email_verifications" as any).delete().eq("id", record.id);

      // Update the user's password using Supabase Admin API
      const { error: updateError } = await supabase.auth.admin.updateUserById(record.user_id, {
        password: password,
      });

      if (updateError) {
        throw new AuthError("Failed to update password. Please try again.", "update_failed");
      }

      // Log the action
      await logAuditAction({
        action: "update",
        target_id: record.user_id,
        target_type: "user",
        new_data: { event: "password_reset" }
      });

      return { success: true };
    } catch (error: any) {
      if (error instanceof AuthError) throw error;
      logEmailError("verifyAndResetPasswordAction", error);
      throw new AuthError("An unexpected error occurred during password reset.", "unknown_error");
    }
  });
