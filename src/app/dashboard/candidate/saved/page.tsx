import { createClient } from "@/lib/supabase/server";
import { Bookmark } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { JobCard } from "@/components/jobs/JobCard";

export const metadata = {
  title: "Saved Jobs | Candidate Dashboard",
};

export default async function CandidateSavedJobsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: savedJobs } = await supabase
    .from("saved_jobs")
    .select(`
      id,
      created_at,
      jobs (
        id,
        title,
        location,
        employment_type,
        salary_range_min,
        salary_range_max,
        currency,
        created_at,
        companies (
          name,
          logo_url
        )
      )
    `)
    .eq("candidate_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col md:flex-row gap-6 justify-between items-start md:items-center">
        <div>
          <h1 className="font-heading text-4xl font-extrabold tracking-tight">Saved Jobs</h1>
          <p className="text-muted-foreground text-lg mt-2 font-medium">Jobs you've bookmarked for later.</p>
        </div>
      </div>

      {savedJobs && savedJobs.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
          {savedJobs.map((saved: any) => {
            const job = saved.jobs;
            if (!job) return null;
            return (
              <JobCard 
                key={saved.id} 
                job={job as any}
                isSaved={true} 
              />
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-[2rem] border-2 border-border shadow-md p-12 text-center">
          <div className="w-24 h-24 bg-muted/50 rounded-full mx-auto flex items-center justify-center mb-6 border-2 border-dashed border-border">
            <Bookmark size={40} className="text-muted-foreground" />
          </div>
          <h3 className="font-heading font-extrabold text-2xl mb-2">No saved jobs</h3>
          <p className="text-muted-foreground font-medium text-lg mb-8 max-w-md mx-auto">
            You haven't saved any jobs yet. Bookmark jobs you're interested in to easily find them later.
          </p>
          <Button asChild className="h-14 px-8 rounded-xl font-bold shadow-sm text-lg">
            <Link href="/jobs">Browse Jobs</Link>
          </Button>
        </div>
      )}
    </div>
  );
}
