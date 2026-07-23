"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function saveCandidateProgress(data: any, step: number) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Unauthorized" };
  }

  // Very basic validation/saving logic for now. 
  // In a full app, use Zod to validate `data` here.

  let processedData = { ...data };
  if (typeof processedData.skills === "string") {
    processedData.skills = processedData.skills
      .split(",")
      .map((s: string) => s.trim())
      .filter(Boolean);
  }

  const { error } = await supabase
    .from("candidate_profiles")
    .upsert({ 
      user_id: user.id, 
      ...processedData 
    }, { onConflict: "user_id" });

  if (error) {
    console.error("Save Candidate Error:", error);
    return { success: false, error: error.message };
  }

  // Update user's current onboarding step
  await supabase
    .from("users")
    .update({ 
      current_step: step,
      last_saved_at: new Date().toISOString()
    })
    .eq("id", user.id);

  return { success: true, timestamp: new Date().toLocaleTimeString() };
}

export async function finishCandidateOnboarding() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Unauthorized" };
  }

  // Use the regular (user-scoped) client so it's consistent with what the layout reads
  const { error } = await supabase
    .from("users")
    .update({ onboarding_completed: true, current_step: 7 })
    .eq("id", user.id);

  if (error) {
    console.error("Finish Onboarding Error:", error);
    // Fallback: try with admin client in case RLS blocks the update
    const supabaseAdmin = createAdminClient();
    const { error: adminError } = await supabaseAdmin
      .from("users")
      .update({ onboarding_completed: true, current_step: 7 })
      .eq("id", user.id);

    if (adminError) {
      console.error("Finish Onboarding Admin Error:", adminError);
      return { success: false, error: adminError.message };
    }
  }

  return { success: true };
}

export async function uploadCandidateResumeAction(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Unauthorized" };
  }

  const file = formData.get("file") as File | null;
  if (!file) {
    return { success: false, error: "No file provided" };
  }

  if (file.size > 10 * 1024 * 1024) {
    return { success: false, error: "File must be less than 10MB" };
  }

  if (file.type !== "application/pdf") {
    return { success: false, error: "File must be a PDF" };
  }

  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(7)}.${fileExt}`;
    
    const fs = require('fs/promises');
    const path = require('path');
    
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'candidate-resumes', user.id);
    await fs.mkdir(uploadDir, { recursive: true });
    
    const filePath = path.join(uploadDir, fileName);
    
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    await fs.writeFile(filePath, buffer);

    const publicUrl = `/uploads/candidate-resumes/${user.id}/${fileName}`;

    return { success: true, filePath: publicUrl };
  } catch (error: any) {
    console.error("Server Upload Error:", error);
    return { success: false, error: error.message || "Failed to upload file" };
  }
}
