"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";

export async function updateCompanyProfile(data: any) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Unauthorized" };
  }

  const supabaseAdmin = createAdminClient();

  // The database schema only has these columns for 'companies'
  const validCompanyFields = ["name", "logo_url", "website", "description", "industry", "location", "company_size", "mission", "remote_policy", "cover_image_url", "social_links", "gallery_urls", "pan_number", "gst_number", "cin_number"];
  const companyData: any = {};
  
  // We assume the DB migration has been run so these columns exist now.
  for (const key of Object.keys(data)) {
    if (validCompanyFields.includes(key)) {
      companyData[key] = data[key];
    }
  }

  const { error } = await supabaseAdmin
    .from("companies")
    .update(companyData)
    .eq("employer_id", user.id);

  if (error) {
    console.error("Update Company Profile Error:", error);
    return { success: false, error: error.message };
  }

  revalidatePath("/dashboard/employer/profile");
  return { success: true };
}
