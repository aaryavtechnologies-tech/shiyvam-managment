"use server";

import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function verifyAdminPinAction(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const pin = formData.get("pin") as string;
  
  const correctPin = process.env.ADMIN_PIN || "7600";

  // 1. Verify PIN
  if (pin !== correctPin) {
    return { success: false, error: "Invalid PIN code" };
  }

  const supabase = await createClient();

  // 2. Authenticate with Supabase
  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (authError || !authData.user) {
    return { success: false, error: "Invalid email or password" };
  }

  // 3. Verify Admin Role in public.users (using Admin client to bypass any RLS)
  const adminSupabase = createAdminClient();
  const { data: userData, error: userError } = await adminSupabase
    .from("users")
    .select("role")
    .eq("id", authData.user.id)
    .single();

  if (userError || userData?.role !== "admin") {
    // Sign out immediately if not admin
    await supabase.auth.signOut();
    return { success: false, error: "Unauthorized: Account is not an administrator" };
  }

  // 4. Set PIN Unlock Cookie
  const cookieStore = await cookies();
  cookieStore.set("admin_unlocked", "true", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 2, // 2 hours
    path: "/",
  });

  return { success: true };
}
