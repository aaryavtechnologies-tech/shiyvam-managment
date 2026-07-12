"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { logAuditAction } from "@/lib/audit";

export async function verifyCompanyAction(companyId: string, status: string, reason?: string) {
  const supabase = await createClient();
  
  // Get current status
  const { data: company, error: fetchErr } = await supabase
    .from("companies")
    .select("verification_status")
    .eq("id", companyId)
    .single();

  if (fetchErr || !company) return { success: false, error: "Company not found." };
  
  const oldStatus = company.verification_status || 'pending';

  // Update status
  const { error: updateErr } = await (supabase.from("companies") as any)
    .update({ verification_status: status })
    .eq("id", companyId);

  if (updateErr) return { success: false, error: updateErr.message };

  // Log to history
  const { data: userData } = await supabase.auth.getUser();
  if (userData?.user) {
    await (supabase.from("employer_approval_history") as any).insert({
      employer_id: null, // we don't strictly have employer_id here unless we query it, let's omit or get it
      admin_id: userData.user.id,
      old_status: oldStatus,
      new_status: status,
      reason: reason || null
    });

    await logAuditAction({
      action: status === "rejected" ? "reject" : "approve",
      admin_id: userData.user.id,
      target_id: companyId,
      target_type: "company",
      old_data: { status: oldStatus },
      new_data: { status: status, reason: reason }
    });
  }

  revalidatePath("/dashboard/admin/employers");
  return { success: true };
}
