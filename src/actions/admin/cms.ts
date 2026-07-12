"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";
import { logAuditAction } from "@/lib/audit";
import { createClient } from "@/lib/supabase/server";

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

// POSTS (Blog & Career Advice)
export async function createPostAction(data: any) {
  try {
    const { supabaseAdmin, user } = await verifyAdmin();
    const { error } = await supabaseAdmin.from("posts").insert(data);
    if (error) throw error;

    await logAuditAction({
      action: "create",
      admin_id: user.id,
      target_type: "post",
      new_data: { title: data.title, category: data.category }
    });

    revalidatePath("/dashboard/admin/cms/posts");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function updatePostAction(id: string, data: any) {
  try {
    const { supabaseAdmin, user } = await verifyAdmin();
    const { error } = await supabaseAdmin.from("posts").update(data).eq("id", id);
    if (error) throw error;

    await logAuditAction({
      action: "update",
      admin_id: user.id,
      target_id: id,
      target_type: "post",
      new_data: data
    });

    revalidatePath("/dashboard/admin/cms/posts");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deletePostAction(id: string) {
  try {
    const { supabaseAdmin, user } = await verifyAdmin();
    const { error } = await supabaseAdmin.from("posts").delete().eq("id", id);
    if (error) throw error;

    await logAuditAction({
      action: "delete",
      admin_id: user.id,
      target_id: id,
      target_type: "post",
    });

    revalidatePath("/dashboard/admin/cms/posts");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// TESTIMONIALS
export async function createTestimonialAction(data: any) {
  try {
    const { supabaseAdmin, user } = await verifyAdmin();
    const { error } = await supabaseAdmin.from("testimonials").insert(data);
    if (error) throw error;

    await logAuditAction({
      action: "create",
      admin_id: user.id,
      target_type: "testimonial",
      new_data: { author: data.author_name }
    });

    revalidatePath("/dashboard/admin/cms/testimonials");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function updateTestimonialAction(id: string, data: any) {
  try {
    const { supabaseAdmin, user } = await verifyAdmin();
    const { error } = await supabaseAdmin.from("testimonials").update(data).eq("id", id);
    if (error) throw error;

    await logAuditAction({
      action: "update",
      admin_id: user.id,
      target_id: id,
      target_type: "testimonial",
    });

    revalidatePath("/dashboard/admin/cms/testimonials");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deleteTestimonialAction(id: string) {
  try {
    const { supabaseAdmin, user } = await verifyAdmin();
    const { error } = await supabaseAdmin.from("testimonials").delete().eq("id", id);
    if (error) throw error;

    await logAuditAction({
      action: "delete",
      admin_id: user.id,
      target_id: id,
      target_type: "testimonial",
    });

    revalidatePath("/dashboard/admin/cms/testimonials");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// FAQS
export async function createFaqAction(data: any) {
  try {
    const { supabaseAdmin, user } = await verifyAdmin();
    const { error } = await supabaseAdmin.from("faq").insert(data);
    if (error) throw error;

    await logAuditAction({
      action: "create",
      admin_id: user.id,
      target_type: "faq",
    });

    revalidatePath("/dashboard/admin/cms/faqs");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function updateFaqAction(id: string, data: any) {
  try {
    const { supabaseAdmin, user } = await verifyAdmin();
    const { error } = await supabaseAdmin.from("faq").update(data).eq("id", id);
    if (error) throw error;

    await logAuditAction({
      action: "update",
      admin_id: user.id,
      target_id: id,
      target_type: "faq",
    });

    revalidatePath("/dashboard/admin/cms/faqs");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deleteFaqAction(id: string) {
  try {
    const { supabaseAdmin, user } = await verifyAdmin();
    const { error } = await supabaseAdmin.from("faq").delete().eq("id", id);
    if (error) throw error;

    await logAuditAction({
      action: "delete",
      admin_id: user.id,
      target_id: id,
      target_type: "faq",
    });

    revalidatePath("/dashboard/admin/cms/faqs");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
