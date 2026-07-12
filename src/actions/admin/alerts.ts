"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";

export async function markAlertAsRead(alertId: string) {
  try {
    const supabaseAdmin = createAdminClient();
    const { error } = await supabaseAdmin
      .from("admin_alerts")
      .update({ is_read: true })
      .eq("id", alertId);

    if (error) throw error;
    revalidatePath("/dashboard/admin/notifications");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function markAllAlertsAsRead() {
  try {
    const supabaseAdmin = createAdminClient();
    const { error } = await supabaseAdmin
      .from("admin_alerts")
      .update({ is_read: true })
      .eq("is_read", false);

    if (error) throw error;
    revalidatePath("/dashboard/admin/notifications");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
