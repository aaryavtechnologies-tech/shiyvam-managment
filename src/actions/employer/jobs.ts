"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";
import { sendAdminAlert } from "@/lib/email/actions/admin-alerts";

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
  
  let salary_range_min = null;
  let salary_range_max = null;
  if (data.salary_range) {
    const nums = data.salary_range.match(/\d+[kKmM]?/g);
    if (nums && nums.length >= 1) {
      const parseNum = (str: string) => {
        let n = parseInt(str.replace(/[kKmM]/g, ''));
        if (str.toLowerCase().includes('k')) n *= 1000;
        if (str.toLowerCase().includes('m')) n *= 1000000;
        return n;
      };
      salary_range_min = parseNum(nums[0]);
      if (nums.length >= 2) {
        salary_range_max = parseNum(nums[1]);
      }
    }
  }

  const { error } = await supabaseAdmin
    .from("jobs")
    .insert({
      employer_id: user.id,
      company_id: company?.id || null,
      title: data.title,
      department: data.department,
      employment_type: data.employment_type,
      location: data.location,
      is_remote: data.work_mode === "Remote",
      description: data.description,
      requirements: data.requirements,
      salary_range_min,
      salary_range_max,
      status: 'Active'
    } as any);

  if (error) {
    console.error("Create Job Error:", error);
    return { success: false, error: error.message };
  }

  // Notify admin
  sendAdminAlert({
    type: "job",
    title: "New Job Posted",
    message: `A new job "\${data.title}" was posted and requires approval.`,
    link: "/dashboard/admin/jobs"
  });

  revalidatePath("/dashboard/employer/jobs");
  return { success: true };
}
