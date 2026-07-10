"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";

export async function createJobAction(data: any) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Unauthorized" };
  }

  const supabaseAdmin = createAdminClient();
  
  // Get employer's company
  const { data: company } = await supabase
    .from("companies")
    .select("id")
    .eq("employer_id", user.id)
    .single();
  
  const { error } = await supabaseAdmin
    .from("jobs")
    .insert({
      employer_id: user.id,
      company_id: company?.id || null,
      title: data.title,
      department: data.department,
      employment_type: data.employment_type,
      location: data.location,
      work_mode: data.work_mode,
      description: data.description,
      requirements: data.requirements,
      salary_range: data.salary_range,
      status: 'Active'
    } as any);

  if (error) {
    console.error("Create Job Error:", error);
    return { success: false, error: error.message };
  }

  revalidatePath("/dashboard/employer/jobs");
  return { success: true };
}
