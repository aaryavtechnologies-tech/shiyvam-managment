import { createAdminClient } from "@/lib/supabase/admin";

export type AuditAction = 'create' | 'update' | 'delete' | 'suspend' | 'activate' | 'approve' | 'reject' | 'login';

export async function logAuditAction(params: {
  action: AuditAction;
  admin_id: string; // The ID of the user performing the action (can be admin, employer, or candidate for login)
  target_id?: string;
  target_type: string;
  old_data?: any;
  new_data?: any;
  ip_address?: string;
  browser?: string;
}) {
  try {
    const supabaseAdmin = createAdminClient();
    const { error } = await supabaseAdmin.from("audit_logs").insert({
      action: params.action,
      admin_id: params.admin_id,
      target_id: params.target_id || null,
      target_type: params.target_type,
      old_data: params.old_data || null,
      new_data: params.new_data || null,
      ip_address: params.ip_address || null,
      browser: params.browser || null,
    });

    if (error) {
      console.error("Failed to insert audit log:", error);
    }
  } catch (error) {
    console.error("Error logging audit action:", error);
  }
}
