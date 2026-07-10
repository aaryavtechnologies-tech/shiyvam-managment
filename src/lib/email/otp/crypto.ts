import crypto from "crypto";
import bcrypt from "bcryptjs";

/**
 * Generates a crypto-secure 6-digit numeric OTP
 */
export function generateOTP(): string {
  // crypto.randomInt is available in Node.js >= 14.10.0
  const otp = crypto.randomInt(100000, 999999);
  return otp.toString();
}

/**
 * Hashes an OTP using bcrypt
 */
export async function hashOTP(otp: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(otp, salt);
}

/**
 * Validates a plain text OTP against a stored hash
 */
export async function verifyOTPHash(otp: string, hash: string): Promise<boolean> {
  return await bcrypt.compare(otp, hash);
}
