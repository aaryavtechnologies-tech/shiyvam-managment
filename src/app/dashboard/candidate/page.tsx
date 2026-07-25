import { createClient } from "@/lib/supabase/server";
import { FileText, Briefcase, Bookmark, ChevronRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function CandidateDashboardOverview() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  // Fetch stats in parallel
  const [profileResult, applicationsResult, savedJobsResult] = await Promise.all([
    supabase.from("candidate_profiles").select("profile_completion, headline").eq("user_id", user.id).single(),
    supabase.from("applications").select("id", { count: "exact" }).eq("candidate_id", user.id),
    supabase.from("saved_jobs").select("id", { count: "exact" }).eq("candidate_id", user.id)
  ]);

  const profile = profileResult.data;
  const applicationsCount = applicationsResult.count || 0;
  const savedJobsCount = savedJobsResult.count || 0;
  const completion = profile?.profile_completion || 0;

  // Fetch recent applications
  const { data: recentApps } = await supabase
    .from("applications")
    .select(`
      id,
      status,
      applied_at,
      jobs (
        title,
        companies (
          name,
          logo_url
        )
      )
    `)
    .eq("candidate_id", user.id)
    .order("applied_at", { ascending: false })
    .limit(3);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Accepted": return "bg-green-100 text-green-700 border-green-300";
      case "Rejected": return "bg-red-100 text-red-700 border-red-300";
      case "Interviewing": return "bg-blue-100 text-blue-700 border-blue-300";
      case "Shortlisted": return "bg-purple-100 text-purple-700 border-purple-300";
      case "Withdrawn": return "bg-gray-200 text-gray-700 border-gray-400";
      default: return "bg-amber-100 text-amber-700 border-amber-300"; // Applied
    }
  };

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col md:flex-row gap-6 justify-between items-start md:items-center">
        <div>
          <h1 className="font-heading text-4xl font-extrabold tracking-tight">Dashboard Overview</h1>
          <p className="text-muted-foreground text-lg mt-2 font-medium">Welcome back! Here's what's happening with your job search.</p>
        </div>
        <Button asChild className="h-14 px-8 rounded-2xl border border-border bg-primary text-primary-foreground font-bold shadow-md hover-lift">
          <Link href="/jobs">
            Browse New Jobs <ChevronRight className="ml-2" size={20} />
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-[2rem] border-2 border-border shadow-[4px_4px_0_0_rgba(0,0,0,1)] hover:shadow-[6px_6px_0_0_rgba(0,0,0,1)] hover:-translate-y-1 transition-all duration-300 p-8 flex flex-col justify-between group">
          <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6 border-2 border-blue-200 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300 shadow-sm">
            <Briefcase size={32} />
          </div>
          <div>
            <h3 className="font-bold text-muted-foreground mb-1 text-lg">Total Applications</h3>
            <p className="font-heading text-5xl font-extrabold">{applicationsCount}</p>
          </div>
        </div>

        <div className="bg-white rounded-[2rem] border-2 border-border shadow-[4px_4px_0_0_rgba(0,0,0,1)] hover:shadow-[6px_6px_0_0_rgba(0,0,0,1)] hover:-translate-y-1 transition-all duration-300 p-8 flex flex-col justify-between group">
          <div className="w-16 h-16 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center mb-6 border-2 border-amber-200 group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-300 shadow-sm">
            <Bookmark size={32} />
          </div>
          <div>
            <h3 className="font-bold text-muted-foreground mb-1 text-lg">Saved Jobs</h3>
            <p className="font-heading text-5xl font-extrabold">{savedJobsCount}</p>
          </div>
        </div>

        <div className="bg-primary text-primary-foreground rounded-[2rem] border-2 border-primary shadow-[4px_4px_0_0_rgba(0,0,0,1)] hover:shadow-[6px_6px_0_0_rgba(0,0,0,1)] hover:-translate-y-1 transition-all duration-300 p-8 flex flex-col justify-between relative overflow-hidden group">
          <div className="absolute -right-10 -bottom-10 opacity-10 group-hover:scale-110 transition-transform duration-500">
            <FileText size={160} />
          </div>
          <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mb-6 relative z-10 border-2 border-white/20 backdrop-blur-md group-hover:bg-white/20 transition-colors duration-300">
            <FileText size={32} />
          </div>
          <div className="relative z-10">
            <div className="flex justify-between items-end mb-2">
              <h3 className="font-bold opacity-90">Profile Strength</h3>
              <span className="font-heading text-3xl font-extrabold">{completion}%</span>
            </div>
            <div className="h-2 bg-black/20 rounded-full overflow-hidden">
              <div className="h-full bg-white" style={{ width: `\${completion}%` }}></div>
            </div>
            {completion < 100 && (
              <Link href="/dashboard/candidate/profile" className="inline-block mt-4 text-sm font-bold underline underline-offset-4 hover:text-white/80">
                Complete your profile &rarr;
              </Link>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-[2rem] border-2 border-border shadow-md p-8">
        <div className="flex justify-between items-center mb-8 border-b-2 border-border pb-4">
          <h2 className="font-heading text-2xl font-extrabold">Recent Applications</h2>
          <Link href="/dashboard/candidate/applications" className="font-bold text-primary hover:underline">
            View All
          </Link>
        </div>

        {recentApps && recentApps.length > 0 ? (
          <div className="space-y-4">
            {recentApps.map((app: any) => (
              <Link href={`/dashboard/candidate/applications`} key={app.id} className="block">
                <div className="flex items-center justify-between p-5 rounded-2xl border-2 border-border hover:border-primary hover:shadow-[4px_4px_0_0_rgba(11,27,61,1)] hover:-translate-y-1 bg-white transition-all duration-300 group">
                  <div className="flex items-center gap-5">
                    <div className="w-14 h-14 rounded-xl bg-muted border-2 border-border overflow-hidden flex-shrink-0 group-hover:scale-105 transition-transform duration-300">
                       {app.jobs?.companies?.logo_url ? (
                        <img src={app.jobs.companies.logo_url} alt={app.jobs.companies.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center font-bold text-muted-foreground">
                          {app.jobs?.companies?.name?.charAt(0) || "C"}
                        </div>
                      )}
                    </div>
                    <div>
                      <h4 className="font-bold text-xl group-hover:text-primary transition-colors mb-1">{app.jobs?.title}</h4>
                      <p className="text-sm font-bold text-muted-foreground flex items-center gap-1">
                        {app.jobs?.companies?.name}
                      </p>
                    </div>
                  </div>
                  <div className="text-right flex flex-col items-end gap-2">
                    <div className={`inline-block px-4 py-1.5 rounded-full font-bold text-sm shadow-sm border-2 ${getStatusColor(app.status)}`}>
                      {app.status}
                    </div>
                    <p className="text-xs font-bold text-muted-foreground flex items-center gap-1 opacity-70">
                      Applied {new Date(app.applied_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-muted/50 rounded-full mx-auto flex items-center justify-center mb-4 border-2 border-dashed border-border">
              <Briefcase size={32} className="text-muted-foreground" />
            </div>
            <h3 className="font-bold text-xl mb-2">No applications yet</h3>
            <p className="text-muted-foreground font-medium mb-6">Start applying for jobs to see your progress here.</p>
            <Button asChild className="rounded-xl font-bold shadow-sm">
              <Link href="/jobs">Find Jobs</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
