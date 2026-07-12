"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

async function verifyAdmin() {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) throw new Error("Unauthorized");

  const { data: userData } = await supabase
    .from("users")
    .select("role")
    .eq("id", user.id)
    .single();

  if (userData?.role !== "admin") throw new Error("Forbidden. Admin role required.");
  return { user, supabaseAdmin: createAdminClient() };
}

export async function approveJobAction(jobId: string) {
  try {
    const { supabaseAdmin } = await verifyAdmin();
    const { error } = await supabaseAdmin
      .from("jobs")
      .update({ admin_status: "approved" })
      .eq("id", jobId);

    if (error) throw error;
    revalidatePath("/dashboard/admin/jobs");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function rejectJobAction(jobId: string, reason: string) {
  try {
    const { supabaseAdmin } = await verifyAdmin();
    const { error } = await supabaseAdmin
      .from("jobs")
      .update({ admin_status: "rejected", rejection_reason: reason })
      .eq("id", jobId);

    if (error) throw error;
    revalidatePath("/dashboard/admin/jobs");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deleteJobAction(jobId: string) {
  try {
    const { supabaseAdmin } = await verifyAdmin();
    const { error } = await supabaseAdmin
      .from("jobs")
      .delete()
      .eq("id", jobId);

    if (error) throw error;
    revalidatePath("/dashboard/admin/jobs");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
