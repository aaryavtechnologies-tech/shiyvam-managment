import { createClient } from "@/lib/supabase/server";
import { notFound, redirect } from "next/navigation";
import { Navbar } from "@/components/home/Navbar";
import { Footer } from "@/components/home/Footer";
import { ApplyForm } from "./_components/apply-form";
import Link from "next/link";
import { ArrowLeft, Building, MapPin, Briefcase } from "lucide-react";

export const metadata = {
  title: "Apply for Job | Shivyam Management Services",
  description: "Submit your application.",
};

export default async function ApplyPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const supabase = await createClient();

  // Ensure user is logged in
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect(`/login?redirect=/jobs/${params.id}/apply`);
  }

  // Check if they already applied
  const { data: existing } = await supabase
    .from("applications")
    .select("id")
    .eq("job_id", params.id)
    .eq("candidate_id", user.id)
    .maybeSingle();

  if (existing) {
    // If they already applied, redirect them back to the job page or dashboard
    redirect(`/jobs/${params.id}`);
  }

  const { data: job, error } = await supabase
    .from("jobs")
    .select(`
      id,
      title,
      location,
      employment_type,
      companies (
        name,
        logo_url
      )
    `)
    .eq("id", params.id)
    .single();

  if (error || !job) {
    notFound();
  }

  // Extract company name for convenience
  const safeJob = job as any;
  const companyName = (safeJob.companies && !Array.isArray(safeJob.companies)) 
    ? safeJob.companies.name 
    : "Company";

  // Fetch candidate's profile to get default resume
  const { data: profile } = await supabase
    .from("candidate_profiles")
    .select("resume_url")
    .eq("user_id", user.id)
    .maybeSingle();

  const existingResume = profile?.resume_url || null;

  return (
    <div className="min-h-screen bg-muted/20 flex flex-col">
      <div className="bg-white border-b-2 border-border shadow-sm sticky top-0 z-50">
        <div className="py-4">
          <Navbar />
        </div>
      </div>

      <main className="flex-1 container mx-auto px-4 md:px-6 py-12">
        <div className="max-w-3xl mx-auto">
          
          <Link href={`/jobs/${params.id}`} className="inline-flex items-center text-muted-foreground hover:text-primary font-bold mb-8 transition-colors">
            <ArrowLeft className="mr-2" size={20} />
            Back to Job Details
          </Link>

          <div className="mb-10">
            <h1 className="font-heading text-4xl font-extrabold mb-4">Submit Your Application</h1>
            
            <div className="bg-white rounded-2xl border-2 border-border p-6 flex flex-col sm:flex-row gap-6 items-start sm:items-center">
              <div className="w-16 h-16 bg-muted rounded-xl border-2 border-border flex items-center justify-center flex-shrink-0 overflow-hidden font-bold text-xl text-primary">
                {safeJob.companies && !Array.isArray(safeJob.companies) && safeJob.companies.logo_url ? (
                  <img src={safeJob.companies.logo_url} alt={companyName} className="w-full h-full object-cover" />
                ) : (
                  companyName.charAt(0) || "C"
                )}
              </div>
              <div>
                <h3 className="font-bold text-2xl mb-2">{safeJob.title}</h3>
                <div className="flex flex-wrap gap-4 text-muted-foreground font-semibold text-sm">
                  <span className="flex items-center gap-1.5"><Building size={16} /> {companyName}</span>
                  <span className="flex items-center gap-1.5"><MapPin size={16} /> {safeJob.location || "Remote"}</span>
                  <span className="flex items-center gap-1.5"><Briefcase size={16} /> {safeJob.employment_type}</span>
                </div>
              </div>
            </div>
          </div>

          <ApplyForm jobId={safeJob.id} jobTitle={safeJob.title} companyName={companyName} candidateResumeUrl={existingResume} />
          
        </div>
      </main>

      <Footer />
    </div>
  );
}
