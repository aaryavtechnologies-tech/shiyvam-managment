"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function saveEmployerProgress(data: any, step: number) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Unauthorized" };
  }

  // Very basic validation/saving logic for now. 
  
  const supabaseAdmin = createAdminClient();

  // The database schema only has these columns for 'companies'
  const validCompanyFields = ["name", "logo_url", "website", "description", "pan_number", "gst_number", "cin_number"];
  const companyData: any = {};
  const metadata: any = {};

  for (const key of Object.keys(data)) {
    if (validCompanyFields.includes(key)) {
      companyData[key] = data[key];
    } else {
      metadata[key] = data[key];
    }
  }

  // Check if company exists
  const { data: existing } = await supabaseAdmin
    .from("companies")
    .select("id")
    .eq("employer_id", user.id)
    .single();

  let dbError;
  if (existing) {
    if (Object.keys(companyData).length > 0) {
      const { error } = await supabaseAdmin
        .from("companies")
        .update(companyData)
        .eq("employer_id", user.id);
      dbError = error;
    }
  } else {
    // Merge from user_metadata on first creation
    const { data: userData } = await supabaseAdmin.auth.admin.getUserById(user.id);
    const existingMeta = userData.user?.user_metadata || {};
    
    const initialCompanyData = { 
      employer_id: user.id, 
      ...companyData 
    };

    if (existingMeta.pan_number) initialCompanyData.pan_number = existingMeta.pan_number;
    if (existingMeta.gst_number) initialCompanyData.gst_number = existingMeta.gst_number;
    if (existingMeta.cin_number) initialCompanyData.cin_number = existingMeta.cin_number;

    const { error } = await supabaseAdmin
      .from("companies")
      .insert(initialCompanyData);
    dbError = error;
  }

  if (dbError) {
    console.error("Save Employer Error:", dbError);
    return { success: false, error: dbError.message };
  }

  // Save everything else (including cover_image_url, industry, etc.) to user metadata
  if (Object.keys(metadata).length > 0) {
    await supabaseAdmin.auth.admin.updateUserById(user.id, {
      user_metadata: metadata
    });
  }

  // Update user's current onboarding step
  await supabaseAdmin
    .from("users")
    .update({ 
      current_step: step,
      last_saved_at: new Date().toISOString()
    })
    .eq("id", user.id);

  return { success: true, timestamp: new Date().toLocaleTimeString() };
}

export async function finishEmployerOnboarding() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Unauthorized" };
  }

  let { error } = await supabase
    .from("users")
    .update({ onboarding_completed: true })
    .eq("id", user.id);

  if (error) {
    const supabaseAdmin = createAdminClient();
    const { error: adminError } = await supabaseAdmin
      .from("users")
      .update({ onboarding_completed: true })
      .eq("id", user.id);
      
    if (adminError) {
      return { success: false, error: adminError.message };
    }
  }

  return { success: true };
}

export async function uploadCompanyAssetAction(formData: FormData, assetType: 'logo' | 'cover') {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Unauthorized" };
  }

  const file = formData.get("file") as File | null;
  if (!file) {
    return { success: false, error: "No file provided" };
  }

  if (file.size > 5 * 1024 * 1024) {
    return { success: false, error: "File must be less than 5MB" };
  }

  try {
    const supabaseAdmin = createAdminClient();
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(7)}.${fileExt}`;
    const filePath = `${user.id}/${fileName}`;
    const bucket = assetType === 'logo' ? 'company-logos' : 'company-assets';

    const { error: uploadError } = await supabaseAdmin.storage
      .from(bucket)
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    // Get the public URL for the uploaded file
    const { data: { publicUrl } } = supabaseAdmin.storage
      .from(bucket)
      .getPublicUrl(filePath);

    // Save it to the company profile immediately
    const field = assetType === 'logo' ? 'logo_url' : 'cover_image_url';
    await saveEmployerProgress({ [field]: publicUrl }, 5); // Step 5 for assets

    return { success: true, url: publicUrl };
  } catch (error: any) {
    console.error(`Asset Upload Error (${assetType}):`, error);
    return { success: false, error: error.message || "Failed to upload file" };
  }
}
