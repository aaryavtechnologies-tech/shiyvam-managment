"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

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

export async function markMessageReadAction(messageId: string) {
  try {
    const { supabaseAdmin } = await verifyAdmin();
    const { error } = await (supabaseAdmin as any)
      .from("contact_messages")
      .update({ status: "read" })
      .eq("id", messageId);

    if (error) throw error;
    revalidatePath("/dashboard/admin/messages");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deleteMessageAction(messageId: string) {
  try {
    const { supabaseAdmin } = await verifyAdmin();
    const { error } = await (supabaseAdmin as any)
      .from("contact_messages")
      .delete()
      .eq("id", messageId);

    if (error) throw error;
    revalidatePath("/dashboard/admin/messages");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
