import { ProfileWizard } from "@/components/candidate/ProfileWizard";
import { createClient } from "@/lib/supabase/server";

export const metadata = {
  title: "Candidate Profile",
};

export default async function CandidateProfilePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  // Fetch existing profile if any
  const { data: profile } = await supabase
    .from("candidate_profiles")
    .select("*")
    .eq("user_id", user.id)
    .single();

  return (
    <div className="max-w-4xl mx-auto w-full pb-20">
      <div className="mb-8">
        <h1 className="font-heading text-4xl font-extrabold tracking-tight">Your Profile</h1>
        <p className="text-muted-foreground text-lg mt-2 font-medium">Complete your profile to increase your chances of landing your dream job.</p>
      </div>

      <ProfileWizard initialData={(profile || {}) as Partial<import("@/lib/validations/candidate").CandidateProfileInput>} />
    </div>
  );
}
