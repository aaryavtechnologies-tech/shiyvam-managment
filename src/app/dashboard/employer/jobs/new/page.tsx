import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { JobWizard } from "./_components/job-wizard";

export default async function NewJobPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  return (
    <div className="max-w-4xl mx-auto py-8">
      <JobWizard employerId={user.id} />
    </div>
  );
}
