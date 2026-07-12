"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";

export async function updateCandidateStatusAction(userId: string, status: string) {
  try {
    const supabaseAdmin = createAdminClient();
    
    // Check if candidate_profile exists
    const { data: profile } = await supabaseAdmin.from("candidate_profiles").select("id").eq("user_id", userId).single();
    
    if (profile) {
      await (supabaseAdmin.from("candidate_profiles") as any).update({ candidate_status: status }).eq("user_id", userId);
    } else {
      await (supabaseAdmin.from("candidate_profiles") as any).insert({ user_id: userId, candidate_status: status });
    }
    
    revalidatePath("/dashboard/admin/candidates");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function assignRecruiterAction(candidateUserId: string, recruiterId: string | null) {
  try {
    const supabaseAdmin = createAdminClient();
    
    const { data: profile } = await supabaseAdmin.from("candidate_profiles").select("id").eq("user_id", candidateUserId).single();
    
    if (profile) {
      await (supabaseAdmin.from("candidate_profiles") as any).update({ assigned_recruiter_id: recruiterId }).eq("user_id", candidateUserId);
    } else {
      await (supabaseAdmin.from("candidate_profiles") as any).insert({ user_id: candidateUserId, assigned_recruiter_id: recruiterId });
    }
    
    revalidatePath("/dashboard/admin/candidates");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
