"use server";

import { createClient, createAdminClient } from "@/lib/supabase/server";

export async function createAdminUser(formData: FormData) {
  try {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const fullName = formData.get("fullName") as string;
    const phone = formData.get("phone") as string;

    if (!email || !password || !fullName) {
      return { success: false, error: "Missing required fields" };
    }

    // Use admin client to create user without signing them in
    const adminSupabase = createAdminClient();
    
    // 1. Create the auth user
    const { data: authData, error: authError } = await adminSupabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Auto-confirm for admin
      user_metadata: {
        full_name: fullName,
        role: "admin",
      }
    });

    if (authError) {
      console.error("Auth creation error:", authError);
      return { success: false, error: authError.message };
    }

    if (!authData.user) {
      return { success: false, error: "Failed to create auth user" };
    }

    // 2. Update the public.users table created by the trigger
    const { error: dbError } = await adminSupabase
      .from("users")
      .update({
        phone: phone || null,
        onboarding_completed: true,
        current_step: 4
      })
      .eq("id", authData.user.id);

    if (dbError) {
      console.error("DB insertion error:", dbError);
      // Clean up the auth user if DB insert fails
      await adminSupabase.auth.admin.deleteUser(authData.user.id);
      return { success: false, error: dbError.message };
    }

    return { success: true };
  } catch (err: any) {
    console.error("Unexpected error in createAdminUser:", err);
    return { success: false, error: err.message || "An unexpected error occurred" };
  }
}

export async function updateAdminProfile(formData: FormData) {
  try {
    const fullName = formData.get("fullName") as string;
    const phone = formData.get("phone") as string;

    if (!fullName) {
      return { success: false, error: "Full Name is required" };
    }

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "Unauthorized" };
    }

    const { error } = await supabase
      .from("users")
      .update({
        full_name: fullName,
        phone: phone || null,
        updated_at: new Date().toISOString()
      })
      .eq("id", user.id);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || "An unexpected error occurred" };
  }
}

export async function changeAdminPassword(formData: FormData) {
  try {
    const currentPassword = formData.get("currentPassword") as string;
    const newPassword = formData.get("newPassword") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    if (!currentPassword || !newPassword || !confirmPassword) {
      return { success: false, error: "All password fields are required" };
    }

    if (newPassword !== confirmPassword) {
      return { success: false, error: "New passwords do not match" };
    }

    if (newPassword.length < 6) {
      return { success: false, error: "New password must be at least 6 characters long" };
    }

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user || !user.email) {
      return { success: false, error: "Unauthorized" };
    }

    // Verify current password by attempting to sign in
    // This requires using signInWithPassword, but since we are server-side, it's safe.
    // It will set cookies, but for the same user, so it just refreshes their session.
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: user.email,
      password: currentPassword
    });

    if (signInError) {
      return { success: false, error: "Incorrect current password" };
    }

    // Update to new password
    const { error: updateError } = await supabase.auth.updateUser({
      password: newPassword
    });

    if (updateError) {
      return { success: false, error: updateError.message };
    }

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || "An unexpected error occurred" };
  }
}

export async function deleteAdminUser(userId: string) {
  try {
    const adminSupabase = createAdminClient();
    
    // Deleting the user from auth.users will automatically cascade to public.users
    const { error } = await adminSupabase.auth.admin.deleteUser(userId);
    
    if (error) {
      console.error("Error deleting admin user:", error);
      return { success: false, error: error.message };
    }
    
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || "An unexpected error occurred" };
  }
}

export async function getAdminsAction() {
  try {
    const adminSupabase = createAdminClient();
    const { data, error } = await adminSupabase
      .from("users")
      .select("id, email, full_name, created_at")
      .eq("role", "admin")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching admins:", error);
      return { success: false, error: error.message };
    }

    return { success: true, admins: data };
  } catch (err: any) {
    console.error("Unexpected error in getAdminsAction:", err);
    return { success: false, error: err.message || "An unexpected error occurred" };
  }
}
