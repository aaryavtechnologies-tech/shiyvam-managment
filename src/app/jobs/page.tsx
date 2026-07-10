import { createClient } from "@/lib/supabase/server";
import { Navbar } from "@/components/home/Navbar";
import { Footer } from "@/components/home/Footer";
import { JobCard } from "@/components/jobs/JobCard";
import { Search, MapPin, Filter } from "lucide-react";
import type { Database } from "@/types/database";

type JobRow = Database["public"]["Tables"]["jobs"]["Row"];
type CompanyRow = Database["public"]["Tables"]["companies"]["Row"];
type JobListing = JobRow & {
  companies: Pick<CompanyRow, "name" | "logo_url"> | null;
};

import { JobSearchBar, JobSidebarFilters } from "@/components/jobs/job-filters";

export const metadata = {
  title: "Browse Jobs | JobPortal",
  description: "Find your dream job from thousands of listings.",
};

export default async function JobsPage(props: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const searchParams = await props.searchParams;
  const supabase = await createClient();
  
  // Extract search params
  const q = typeof searchParams.q === 'string' ? searchParams.q : '';
  const location = typeof searchParams.location === 'string' ? searchParams.location : '';
  const type = typeof searchParams.type === 'string' ? searchParams.type : '';
  const mode = typeof searchParams.mode === 'string' ? searchParams.mode : '';
  const exp = typeof searchParams.exp === 'string' ? searchParams.exp : '';

  // Server-side filtering
  let query = supabase
    .from("jobs")
    .select(`
      *,
      companies (
        name,
        logo_url
      )
    `)
    .eq("status", "Active") // Changed from "published" to match the actual created status
    .order("created_at", { ascending: false });

  if (q) {
    query = query.ilike("title", `%\${q}%`);
  }
  if (location) {
    query = query.ilike("location", `%\${location}%`);
  }
  if (type) {
    query = query.in("employment_type", type.split(","));
  }
  if (mode) {
    query = query.in("work_mode", mode.split(","));
  }
  // If we had an experience_level column on jobs, we'd filter it here. Currently skipping for schema alignment.

  const { data: rawJobs, error } = await query;
  const jobs = rawJobs as unknown as JobListing[] | null;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <main className="flex-1 container mx-auto px-4 md:px-6 pt-32 pb-12">
        <div className="mb-10 text-center max-w-2xl mx-auto">
          <h1 className="font-heading text-4xl md:text-5xl font-extrabold uppercase tracking-tight mb-4">
            Find Your <span className="text-primary">Next Role</span>
          </h1>
          <p className="text-xl font-medium text-muted-foreground">
            Browse through thousands of job openings and find the perfect match for your career.
          </p>
        </div>

        <JobSearchBar />

        <div className="flex flex-col lg:flex-row gap-8">
          <JobSidebarFilters />

          {/* Job Listings */}
          <div className="flex-1 mt-12 lg:mt-0">
            <div className="mb-6 flex justify-between items-center">
              <h2 className="font-bold text-xl">{jobs?.length || 0} Jobs Found</h2>
              <select className="border-2 border-border rounded-lg px-3 py-2 font-bold bg-white focus:outline-none focus:border-primary">
                <option>Newest Postings</option>
                <option>Highest Salary</option>
              </select>
            </div>

            {error ? (
              <div className="bg-red-50 text-red-600 p-6 rounded-2xl border-2 border-red-200 font-bold">
                Error loading jobs: {error.message}
              </div>
            ) : !jobs || jobs.length === 0 ? (
              <div className="bg-white border-2 border-dashed border-border rounded-3xl p-12 text-center">
                <div className="text-6xl mb-4">🕵️‍♂️</div>
                <h3 className="font-heading font-extrabold text-2xl mb-2">No jobs found</h3>
                <p className="text-muted-foreground font-medium text-lg max-w-md mx-auto">
                  We couldn't find any jobs matching your search criteria. Try adjusting your filters or search terms.
                </p>
              </div>
            ) : (
              <div className="grid gap-6">
                {jobs.map(job => (
                  <JobCard key={job.id} job={job as any} />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
