"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { logAuditAction } from "@/lib/audit";

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

export async function deleteUserAction(userId: string) {
  try {
    const { supabaseAdmin } = await verifyAdmin();
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
