"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";

export async function updateApplicationStatusAction(applicationId: string, status: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Unauthorized" };
  }

  const supabaseAdmin = createAdminClient();
  
  // Verify ownership: does the application belong to a job owned by this user?
  const { data: application } = await supabaseAdmin
    .from("applications")
    .select("job_id, jobs!inner(employer_id)")
    .eq("id", applicationId)
    .single();

  if (!application || (application as any).jobs?.employer_id !== user.id) {
    return { success: false, error: "Unauthorized or Application not found" };
  }

  const { error } = await supabaseAdmin
    .from("applications")
    .update({ status })
    .eq("id", applicationId);

  if (error) {
    console.error("Update Application Status Error:", error);
    return { success: false, error: error.message };
  }

  revalidatePath("/dashboard/employer/applications");
  revalidatePath(`/dashboard/employer/applications/${applicationId}`);
  return { success: true };
}
