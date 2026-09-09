"use server";

import { actionClient } from "@/lib/action";
import { loginSchema, registerSchema } from "@/lib/validations/auth";
import { logAuditAction } from "@/lib/audit";
import { sendAdminAlert } from "@/lib/email/actions/admin-alerts";
import { createClient, createAdminClient } from "@/lib/supabase/server";
import { AuthError } from "@/types/auth";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { sendOTP } from "@/lib/email/actions/otp";

export const signUpAction = actionClient
  .schema(registerSchema)
  .action(async ({ parsedInput: { email, password, fullName, role, panNumber, gstNumber, cinNumber } }) => {
    const adminSupabase = createAdminClient();

    const { data, error } = await adminSupabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Auto-confirm in Supabase Auth to allow immediate login
      user_metadata: {
        full_name: fullName,
        role: role,
        ...(role === 'employer' ? { pan_number: panNumber, gst_number: gstNumber, cin_number: cinNumber } : {})
      },
    });

    if (error) {
      if (error.code === "email_exists") {
        throw new AuthError("You already have an account! Please sign in instead.", error.code);
      }
      throw new AuthError(error.message, error.code);
    }

    if (data.user) {
      // Fire and forget the OTP sending logic
      await sendOTP(email, data.user.id);
      
      // Fire and forget admin alert
      sendAdminAlert({
        type: "registration",
        title: `New \${role === 'employer' ? 'Employer' : 'Candidate'} Registration`,
        message: `\${fullName} (\${email}) just signed up for a new account.`,
        link: role === 'employer' ? "/dashboard/admin/employers" : "/dashboard/admin/candidates"
      });
    }

    // Immediately log the user in so they have a session for onboarding
    const supabase = await createClient();
    const { data: signInData } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    revalidatePath("/");
    return { success: true, user: data.user, session: signInData.session };
  });

export const signInAction = actionClient
  .schema(loginSchema)
  .action(async ({ parsedInput: { email, password } }) => {
    const supabase = await createClient();

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw new AuthError("Invalid email or password", error.code);
    }

    const adminSupabase = createAdminClient();
    const { data: rawProfile } = await adminSupabase
      .from("users")
      .select("role, onboarding_completed")
      .eq("id", data.user.id)
      .single();
      
    const profile = rawProfile as { role?: string, onboarding_completed?: boolean } | null;

    // Log the login event
    await logAuditAction({
      action: "login",
      admin_id: data.user.id,
      target_id: data.user.id,
      target_type: "user",
      new_data: { role: profile?.role }
    });

    revalidatePath("/");
    return { success: true, user: data.user, role: profile?.role, onboarding_completed: profile?.onboarding_completed };
  });

export async function signOutAction() {
  const supabase = await createClient();
  const { error } = await supabase.auth.signOut();

  if (error) {
    throw new AuthError(error.message, error.code);
  }

  // Explicitly redirect to login after signing out
  // This prevents the "unexpected response" error that happens when Next.js
  // tries to re-render the protected layout as part of the action response
  redirect("/login");
}
