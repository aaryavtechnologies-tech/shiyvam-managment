"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { logAuditAction } from "@/lib/audit";

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

export async function approveJobAction(jobId: string) {
  try {
    const { supabaseAdmin, user } = await verifyAdmin();
    const { error } = await (supabaseAdmin.from("jobs") as any)
      .update({ admin_status: "approved" })
      .eq("id", jobId);

    if (error) throw error;

    await logAuditAction({
      action: "approve",
      admin_id: user.id,
      target_id: jobId,
      target_type: "job",
    });

    revalidatePath("/dashboard/admin/jobs");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function rejectJobAction(jobId: string, reason: string) {
  try {
    const { supabaseAdmin, user } = await verifyAdmin();
    const { error } = await (supabaseAdmin.from("jobs") as any)
      .update({ admin_status: "rejected", rejection_reason: reason })
      .eq("id", jobId);

    if (error) throw error;

    await logAuditAction({
      action: "reject",
      admin_id: user.id,
      target_id: jobId,
      target_type: "job",
      new_data: { reason }
    });

    revalidatePath("/dashboard/admin/jobs");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deleteJobAction(jobId: string) {
  try {
    const { supabaseAdmin, user } = await verifyAdmin();
    const { error } = await (supabaseAdmin.from("jobs") as any)
      .delete()
      .eq("id", jobId);

    if (error) throw error;
    revalidatePath("/dashboard/admin/jobs");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getAdminJobsAction() {
  try {
    const { supabaseAdmin } = await verifyAdmin();
    const { data, error } = await supabaseAdmin
      .from("jobs")
      .select(`
        *,
        companies (name, logo_url, industry, verification_status),
        applications (count)
      `)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return { success: true, data };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function adminCreateJobAction(formData: FormData) {
  try {
    const { supabaseAdmin, user } = await verifyAdmin();
    
    const companyName = formData.get("companyName") as string;
    const industry = formData.get("industry") as string;
    const logoUrlInput = formData.get("logoUrl") as string;
    const logoFile = formData.get("logoFile") as File | null;

    let finalLogoUrl = logoUrlInput || null;

    if (logoFile && logoFile.size > 0) {
      // Ensure bucket exists (ignore error if it already does)
      await supabaseAdmin.storage.createBucket("company-logos", { public: true }).catch(() => {});
      
      const fileExt = logoFile.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      
      const { error: uploadError } = await supabaseAdmin.storage
        .from("company-logos")
        .upload(fileName, logoFile);
        
      if (uploadError) throw uploadError;
      
      const { data: publicUrlData } = supabaseAdmin.storage
        .from("company-logos")
        .getPublicUrl(fileName);
        
      finalLogoUrl = publicUrlData.publicUrl;
    }

    // Look for a company with the exact name so admins can create jobs for different companies
    let { data: existingCompany } = await supabaseAdmin
      .from("companies")
      .select("id, logo_url")
      .eq("name", companyName)
      .limit(1)
      .maybeSingle();

    let companyId = existingCompany?.id;

    if (!companyId) {
      const { data: newCompany, error: newCompanyError } = await supabaseAdmin
        .from("companies")
        .insert({
          employer_id: user.id,
          name: companyName || "System Admin",
          industry: industry || "Management",
          logo_url: finalLogoUrl,
          verification_status: "verified"
        } as any)
        .select("id")
        .single();
        
      if (newCompanyError) throw newCompanyError;
      companyId = newCompany.id;
    } else {
      // If company exists, update logo if a new one was provided
      if (finalLogoUrl && finalLogoUrl !== existingCompany?.logo_url) {
        await supabaseAdmin.from("companies").update({ logo_url: finalLogoUrl }).eq("id", companyId);
      }
    }

    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const requirements = formData.get("requirements") as string;
    const minSalary = formData.get("minSalary") ? parseInt(formData.get("minSalary") as string) : null;
    const maxSalary = formData.get("maxSalary") ? parseInt(formData.get("maxSalary") as string) : null;
    const employmentType = formData.get("employmentType") as string;
    const location = formData.get("location") as string;
    const department = formData.get("department") as string;

    const { error: jobError } = await supabaseAdmin
      .from("jobs")
      .insert({
        employer_id: user.id,
        company_id: companyId,
        title,
        description,
        requirements,
        salary_range_min: minSalary,
        salary_range_max: maxSalary,
        employment_type: employmentType,
        location,
        department,
        status: "published",
        admin_status: "approved"
      } as any);

    if (jobError) throw jobError;

    revalidatePath("/dashboard/admin/jobs");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
