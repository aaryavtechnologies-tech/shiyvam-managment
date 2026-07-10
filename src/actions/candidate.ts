"use server";

import { actionClient } from "@/lib/action";
import { candidateProfileSchema, applicationSchema } from "@/lib/validations/candidate";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import * as z from "zod";

// --- PROFILE MANAGEMENT ---

export const updateCandidateProfileAction = actionClient
  .schema(candidateProfileSchema)
  .action(async ({ parsedInput }) => {
    const supabase = await createClient();
    
    // Auth Check
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Unauthorized");
    
    // Ensure role is candidate
    const { data: profile } = await supabase
      .from("users")
      .select("role")
      .eq("id", user.id)
      .single() as any;
      
    if (profile?.role !== "candidate") {
      throw new Error("Only candidates can update this profile.");
    }

    // Update Profile
    const { error } = await supabase
      .from("candidate_profiles")
      .update({
        ...parsedInput,
        profile_completion: calculateProfileCompletion(parsedInput),
        updated_at: new Date().toISOString()
      })
      .eq("user_id", user.id);

    if (error) {
      console.error(error);
      throw new Error("Failed to update profile: " + error.message);
    }

    revalidatePath("/dashboard/candidate/profile");
    return { success: true };
  });

function calculateProfileCompletion(data: any): number {
  let score = 0;
  const fields = ['headline', 'phone', 'city', 'country', 'experience_level', 'resume_url'];
  fields.forEach(field => {
    if (data[field] && data[field].length > 0) score += 10;
  });
  if (data.skills && data.skills.length > 0) score += 20;
  if (data.education && data.education.length > 0) score += 20;
  return Math.min(score, 100);
}

// --- JOB APPLICATIONS ---

export const applyForJobAction = actionClient
  .schema(applicationSchema)
  .action(async ({ parsedInput }) => {
    const supabase = await createClient();
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Unauthorized");

    // Check if already applied
    const { data: existing } = await supabase
      .from("applications")
      .select("id")
      .eq("job_id", parsedInput.job_id)
      .eq("candidate_id", user.id)
      .single();

    if (existing) {
      throw new Error("You have already applied for this job.");
    }

    const { error } = await supabase
      .from("applications")
      .insert({
        job_id: parsedInput.job_id,
        candidate_id: user.id,
        cover_letter: parsedInput.cover_letter,
        resume_url: parsedInput.resume_url,
        expected_salary: parsedInput.expected_salary,
        notice_period: parsedInput.notice_period,
        portfolio_url: parsedInput.portfolio_url,
        status: "Applied"
      } as any);

    if (error) throw new Error("Failed to submit application.");

    revalidatePath(`/jobs/${parsedInput.job_id}`);
    revalidatePath("/dashboard/candidate/applications");
    return { success: true };
  });

export const withdrawApplicationAction = actionClient
  .schema(z.object({ application_id: z.string().uuid() }))
  .action(async ({ parsedInput: { application_id } }) => {
    const supabase = await createClient();
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Unauthorized");

    const { error } = await supabase
      .from("applications")
      .update({ status: "Withdrawn" })
      .eq("id", application_id)
      .eq("candidate_id", user.id)
      .eq("status", "Applied"); // Can only withdraw if in Applied state

    if (error) throw new Error("Failed to withdraw application. It may have progressed past the initial stage.");

    revalidatePath("/dashboard/candidate/applications");
    return { success: true };
  });

// --- SAVED JOBS ---

export const toggleSavedJobAction = actionClient
  .schema(z.object({ job_id: z.string().uuid() }))
  .action(async ({ parsedInput: { job_id } }) => {
    const supabase = await createClient();
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Unauthorized");

    // Check if saved
    const { data: saved } = await supabase
      .from("saved_jobs")
      .select("id")
      .eq("job_id", job_id)
      .eq("candidate_id", user.id)
      .maybeSingle();

    if (saved) {
      // Remove
      await supabase.from("saved_jobs").delete().eq("id", saved.id);
      revalidatePath("/dashboard/candidate/saved");
      return { saved: false };
    } else {
      // Add
      await supabase.from("saved_jobs").insert({ job_id, candidate_id: user.id });
      revalidatePath("/dashboard/candidate/saved");
      return { saved: true };
    }
  });
