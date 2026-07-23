"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { logAuditAction } from "@/lib/audit";

async function verifyAdmin() {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) throw new Error("Unauthorized");

  const supabaseAdmin = createAdminClient();
  const { data: userData } = await supabaseAdmin
    .from("users")
    .select("role")
    .eq("id", user.id)
    .single();

  if (userData?.role !== "admin") throw new Error("Forbidden. Admin role required.");
  return { user, supabaseAdmin };
}

export async function deleteUserAction(userId: string) {
  try {
    const { supabaseAdmin, user } = await verifyAdmin();
    const { error } = await supabaseAdmin.auth.admin.deleteUser(userId);

    if (error) throw error;

    await logAuditAction({
      action: "delete",
      admin_id: user.id,
      target_id: userId,
      target_type: "user",
    });

    revalidatePath("/dashboard/admin/users");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getAdminEmployersAction() {
  try {
    const { supabaseAdmin } = await verifyAdmin();
    const { data, error } = await supabaseAdmin
      .from("users")
      .select(`
        id, email, full_name, created_at,
        companies (id, name, pan_number, gst_number, cin_number, verification_status)
      `)
      .eq("role", "employer")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return { success: true, data };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getAdminCandidatesAction() {
  try {
    const { supabaseAdmin } = await verifyAdmin();
    const { data, error } = await supabaseAdmin
      .from("users")
      .select(`
        id, email, full_name, created_at,
        applications (id),
        candidate_profiles:candidate_profiles!candidate_profiles_user_id_fkey (candidate_status, resume_url, assigned_recruiter_id)
      `)
      .eq("role", "candidate")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return { success: true, data };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getAdminRecruitersAction() {
  try {
    const { supabaseAdmin } = await verifyAdmin();
    const { data, error } = await supabaseAdmin
      .from("users")
      .select("id, full_name, email")
      .eq("role", "employer");

    if (error) throw error;
    return { success: true, data };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getAdminCandidateDetailAction(userId: string) {
  try {
    const { supabaseAdmin } = await verifyAdmin();
    const { data, error } = await supabaseAdmin
      .from("users")
      .select(`
        *,
        candidate_profiles:candidate_profiles!candidate_profiles_user_id_fkey (*),
        applications (
          id, status, applied_at,
          jobs (id, title, companies (name))
        )
      `)
      .eq("id", userId)
      .single();

    if (error) throw error;
    return { success: true, data };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
