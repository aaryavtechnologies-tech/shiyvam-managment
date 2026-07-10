import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { redirect } from "next/navigation";
import { CompanyProfileForm } from "./_components/company-profile-form";

export default async function CompanyProfilePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const supabaseAdmin = createAdminClient();
  
  // Fetch existing company profile
  const { data: company } = await supabaseAdmin
    .from("companies")
    .select("*")
    .eq("employer_id", user.id)
    .single();

  if (!company) {
    return <div>Company profile not found. Please complete onboarding.</div>;
  }

  const { data: userAuthRecord } = await supabaseAdmin.auth.admin.getUserById(user.id);

  const metadata = userAuthRecord?.user?.user_metadata || {};
  
  const companyData = company as any;
  const initialData = {
    name: companyData.name || "",
    industry: companyData.industry || metadata.industry || "",
    website: companyData.website || "",
    location: companyData.location || metadata.location || "",
    company_size: companyData.company_size || metadata.company_size || "",
    description: companyData.description || "",
    mission: companyData.mission || metadata.mission || "",
    remote_policy: companyData.remote_policy || metadata.remote_policy || "",
    logo_url: companyData.logo_url || "",
    cover_image_url: companyData.cover_image_url || metadata.cover_image_url || "",
  };

  return (
    <div className="space-y-8 max-w-4xl animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="font-heading text-3xl font-black tracking-tight">Company Profile</h1>
        <p className="text-muted-foreground font-medium mt-1">Manage your public company page and brand assets.</p>
      </div>

      <CompanyProfileForm initialData={initialData} />
    </div>
  );
}
