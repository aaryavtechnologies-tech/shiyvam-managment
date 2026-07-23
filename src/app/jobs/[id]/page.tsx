import { createClient } from "@/lib/supabase/server";
import { Navbar } from "@/components/home/Navbar";
import { Footer } from "@/components/home/Footer";
import { notFound } from "next/navigation";
import Link from "next/link";
import { MapPin, Briefcase, DollarSign, Clock, Building, CheckCircle2, ChevronRight, Share2, Bookmark } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ApplyModal } from "@/components/candidate/ApplyModal";
import type { Database } from "@/types/database";

type JobRow = Database["public"]["Tables"]["jobs"]["Row"];
type CompanyRow = Database["public"]["Tables"]["companies"]["Row"];
type JobWithCompany = JobRow & {
  companies: Pick<CompanyRow, "name" | "logo_url" | "description" | "website"> | null;
};

export async function generateMetadata(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const supabase = await createClient();
  const { data: job } = await supabase.from("jobs").select("title").eq("id", params.id).single();
  return {
    title: job ? `${job.title} | Shivyam Management Services` : "Job Not Found",
  };
}

export default async function JobDetailsPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const supabase = await createClient();

  const { data: jobData, error } = await supabase
    .from("jobs")
    .select(`
      *,
      companies (
        name,
        logo_url,
        description,
        website
      )
    `)
    .eq("id", params.id)
    .single();

  if (error || !jobData) {
    notFound();
  }

  // Cast to explicit type — TypeScript can't narrow through notFound() with Supabase error unions
  const job = jobData as unknown as JobWithCompany;

  // Check if logged in and if already applied
  const { data: { user } } = await supabase.auth.getUser();
  let hasApplied = false;
  let isSaved = false;

  if (user) {
    const { data: app } = await supabase
      .from("applications")
      .select("id")
      .eq("job_id", params.id)
      .eq("candidate_id", user.id)
      .maybeSingle();

    hasApplied = !!app;

    const { data: saved } = await supabase
      .from("saved_jobs")
      .select("id")
      .eq("job_id", params.id)
      .eq("candidate_id", user.id)
      .maybeSingle();

    isSaved = !!saved;
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <main className="flex-1">
        {/* Job Header Hero */}
        <div className="bg-primary pt-32 pb-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('/noise.png')] opacity-10 mix-blend-overlay"></div>
          <div className="container mx-auto px-4 md:px-6 relative z-10 text-primary-foreground">
            <div className="flex flex-col md:flex-row gap-8 items-start justify-between">
              <div className="flex gap-6 items-start max-w-3xl">
                <div className="w-24 h-24 bg-white rounded-[2rem] border-4 border-white shadow-md flex items-center justify-center flex-shrink-0 overflow-hidden text-primary font-bold text-3xl">
                  {job.companies?.logo_url ? (
                    <img src={job.companies.logo_url} alt={job.companies.name ?? ""} className="w-full h-full object-cover" />
                  ) : (
                    job.companies?.name?.charAt(0) || "C"
                  )}
                </div>
                <div>
                  <h1 className="font-heading text-4xl md:text-5xl font-extrabold mb-4">{job.title}</h1>
                  <div className="flex flex-wrap gap-x-6 gap-y-3 font-semibold text-lg opacity-90">
                    <span className="flex items-center gap-2"><Building size={20} /> {job.companies?.name || "Unknown Company"}</span>
                    <span className="flex items-center gap-2"><MapPin size={20} /> {job.location || "Remote"}</span>
                    <span className="flex items-center gap-2"><Briefcase size={20} /> {job.employment_type}</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                <Button variant="outline" className="h-14 px-6 rounded-2xl border-white text-white hover:bg-white hover:text-primary font-bold shadow-sm text-lg flex items-center gap-2">
                  <Bookmark size={20} fill={isSaved ? "currentColor" : "none"} />
                  {isSaved ? "Saved" : "Save Job"}
                </Button>
                {hasApplied ? (
                  <Button disabled className="h-14 px-8 rounded-2xl border border-border bg-green-500 text-white font-bold shadow-md text-lg flex items-center gap-2 opacity-100">
                    <CheckCircle2 size={24} />
                    Applied
                  </Button>
                ) : (
                  <Link href={`/jobs/${params.id}/apply`}>
                    <Button className="h-14 px-10 rounded-2xl border border-border bg-white text-primary hover:bg-white hover:-translate-y-1 font-bold shadow-md text-lg flex items-center gap-2">
                      Apply Now
                      <ChevronRight size={20} />
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 md:px-6 py-12">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-12">
              <section className="bg-white rounded-3xl border-2 border-border shadow-md p-8 md:p-10">
                <h2 className="font-heading font-extrabold text-2xl mb-6 flex items-center gap-3">
                  Job Description
                </h2>
                <div className="prose prose-lg max-w-none font-medium text-muted-foreground whitespace-pre-wrap">
                  {job.description}
                </div>
              </section>

              {job.requirements && (
                <section className="bg-white rounded-3xl border-2 border-border shadow-md p-8 md:p-10">
                  <h2 className="font-heading font-extrabold text-2xl mb-6">Requirements</h2>
                  <div className="prose prose-lg max-w-none font-medium text-muted-foreground whitespace-pre-wrap">
                    {job.requirements}
                  </div>
                </section>
              )}

              {job.benefits && (
                <section className="bg-white rounded-3xl border-2 border-border shadow-md p-8 md:p-10">
                  <h2 className="font-heading font-extrabold text-2xl mb-6">Benefits</h2>
                  <div className="prose prose-lg max-w-none font-medium text-muted-foreground whitespace-pre-wrap">
                    {job.benefits}
                  </div>
                </section>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
              <div className="bg-white rounded-3xl border-2 border-border shadow-md p-8">
                <h3 className="font-heading font-extrabold text-xl mb-6">Job Summary</h3>
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center flex-shrink-0">
                      <DollarSign size={24} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-muted-foreground mb-1">Salary</p>
                      <p className="font-bold text-lg">
                        {job.salary_range_min ? `${job.salary_range_min/1000}k - ${job.salary_range_max!/1000}k ${job.currency}` : "Not disclosed"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center flex-shrink-0">
                      <MapPin size={24} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-muted-foreground mb-1">Location</p>
                      <p className="font-bold text-lg">{job.location || (job.is_remote ? "Remote" : "Not specified")}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center flex-shrink-0">
                      <Briefcase size={24} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-muted-foreground mb-1">Job Type</p>
                      <p className="font-bold text-lg">{job.employment_type}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center flex-shrink-0">
                      <Clock size={24} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-muted-foreground mb-1">Date Posted</p>
                      <p className="font-bold text-lg">{new Date(job.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-8 border-t-2 border-border">
                  <Button variant="outline" className="w-full h-14 rounded-xl border border-border shadow-sm font-bold text-lg flex items-center gap-2">
                    <Share2 size={20} />
                    Share Job
                  </Button>
                </div>
              </div>

              <div className="bg-muted/30 rounded-3xl border-2 border-border p-8">
                <h3 className="font-heading font-extrabold text-xl mb-4">About {job.companies?.name || "the Company"}</h3>
                <p className="font-medium text-muted-foreground mb-6 line-clamp-4">
                  {job.companies?.description || "No description provided by the company."}
                </p>
                {job.companies?.website && (
                  <a href={job.companies.website} target="_blank" rel="noopener noreferrer" className="font-bold text-primary hover:underline">
                    Visit Website &rarr;
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
