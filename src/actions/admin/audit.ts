"use server";

import { createClient } from "@/lib/supabase/server";
import { headers } from "next/headers";
import type { Database } from "@/types/database";

type AuditActionType = 'create' | 'update' | 'delete' | 'suspend' | 'activate' | 'approve' | 'reject' | 'login';

export async function logAdminAction({
  action,
  targetId,
  targetType,
  oldData,
  newData,
}: {
  action: AuditActionType;
  targetId?: string;
  targetType: string;
  oldData?: any;
  newData?: any;
}) {
  const supabase = await createClient();
  
  // 1. Get Admin Session
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    throw new Error("Unauthorized to perform admin actions.");
  }

  // 2. Verify Admin Role
  const { data: userData } = await supabase
    .from("users")
    .select("role")
    .eq("id", user.id)
    .single() as { data: { role: Database["public"]["Tables"]["users"]["Row"]["role"] } | null };

  if (userData?.role !== "admin") {
    throw new Error("Forbidden. Admin role required.");
  }

  // 3. Extract request metadata
  const headersList = await headers();
  const ipAddress = headersList.get("x-forwarded-for") || "unknown";
  const browser = headersList.get("user-agent") || "unknown";

  // 4. Log Action
  const { error: logError } = await supabase
    .from("audit_logs")
    .insert({
      admin_id: user.id,
      action,
      target_id: targetId,
      target_type: targetType,
      ip_address: ipAddress,
      browser,
      old_data: oldData ? JSON.stringify(oldData) : null,
      new_data: newData ? JSON.stringify(newData) : null,
    } as Database["public"]["Tables"]["audit_logs"]["Insert"]);

  if (logError) {
    console.error("Failed to insert audit log:", logError);
    // In production, we might want to alert system monitoring here
  }
}
