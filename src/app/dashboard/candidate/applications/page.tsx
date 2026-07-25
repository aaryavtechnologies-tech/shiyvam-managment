import { createClient } from "@/lib/supabase/server";
import { Briefcase, ChevronRight, Download, Search } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { StatusTimeline } from "@/components/applications/status-timeline";

export const metadata = {
  title: "My Applications | Candidate Dashboard",
};

export default async function CandidateApplicationsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: applications } = await supabase
    .from("applications")
    .select(`
      id,
      status,
      applied_at,
      resume_url,
      jobs (
        id,
        title,
        location,
        companies (
          name,
          logo_url
        )
      )
    `)
    .eq("candidate_id", user.id)
    .order("applied_at", { ascending: false });

  // Group applications by status for visual breakdown
  const statusCounts = applications?.reduce((acc: any, app: any) => {
    acc[app.status] = (acc[app.status] || 0) + 1;
    return acc;
  }, {}) || {};

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col md:flex-row gap-6 justify-between items-start md:items-center">
        <div>
          <h1 className="font-heading text-4xl font-extrabold tracking-tight">My Applications</h1>
          <p className="text-muted-foreground text-lg mt-2 font-medium">Track and manage your job applications.</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-2xl border-2 border-border shadow-sm text-center">
          <p className="text-muted-foreground font-bold mb-1">Total</p>
          <p className="text-3xl font-heading font-extrabold">{applications?.length || 0}</p>
        </div>
        <div className="bg-blue-50 p-6 rounded-2xl border-2 border-blue-200 text-center">
          <p className="text-blue-600 font-bold mb-1">In Progress</p>
          <p className="text-3xl font-heading font-extrabold text-blue-800">
            {(statusCounts['Applied'] || 0) + (statusCounts['Under Review'] || 0) + (statusCounts['Shortlisted'] || 0) + (statusCounts['Interview Scheduled'] || 0) + (statusCounts['Interviewed'] || 0)}
          </p>
        </div>
        <div className="bg-green-50 p-6 rounded-2xl border-2 border-green-200 text-center">
          <p className="text-green-600 font-bold mb-1">Offers</p>
          <p className="text-3xl font-heading font-extrabold text-green-800">
            {(statusCounts['Offer Sent'] || 0) + (statusCounts['Hired'] || 0)}
          </p>
        </div>
        <div className="bg-red-50 p-6 rounded-2xl border-2 border-red-200 text-center">
          <p className="text-red-600 font-bold mb-1">Rejected</p>
          <p className="text-3xl font-heading font-extrabold text-red-800">
            {statusCounts['Rejected'] || 0}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-[2rem] border-2 border-border shadow-md overflow-hidden">
        <div className="p-6 border-b-2 border-border flex flex-col md:flex-row gap-4 justify-between items-center bg-muted/20">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
            <input 
              type="text" 
              placeholder="Search applications..." 
              className="w-full h-12 pl-12 pr-4 rounded-xl border-2 border-border shadow-sm focus:outline-none focus:border-primary font-medium"
            />
          </div>
          <select className="h-12 border-2 border-border rounded-xl px-4 font-bold bg-white focus:outline-none focus:border-primary shadow-sm">
            <option value="all">All Statuses</option>
            <option value="Applied">Applied</option>
            <option value="Interviewing">Interviewing</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>

        <div className="p-0">
          {applications && applications.length > 0 ? (
            <div className="divide-y-2 divide-border">
              {applications.map((app: any) => (
                <div key={app.id} className="p-6 hover:bg-muted/30 transition-colors flex flex-col md:flex-row gap-6 justify-between items-start md:items-center">
                  <div className="flex gap-4 items-start">
                    <div className="w-16 h-16 rounded-xl bg-white border-2 border-border overflow-hidden flex-shrink-0 flex items-center justify-center font-bold text-xl text-muted-foreground">
                      {app.jobs?.companies?.logo_url ? (
                        <img src={app.jobs.companies.logo_url} alt={app.jobs.companies.name} className="w-full h-full object-cover" />
                      ) : (
                        app.jobs?.companies?.name?.charAt(0) || "C"
                      )}
                    </div>
                    <div>
                      <Link href={`/jobs/${app.jobs?.id}`} className="font-heading text-xl font-extrabold hover:text-primary transition-colors line-clamp-1">
                        {app.jobs?.title}
                      </Link>
                      <p className="font-bold text-muted-foreground mb-2">{app.jobs?.companies?.name} • {app.jobs?.location}</p>
                      <p className="text-sm font-semibold text-muted-foreground flex items-center gap-1">
                        Applied: {new Date(app.applied_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex flex-col md:flex-row items-start md:items-center gap-4 w-full md:w-auto">
                    <div className="flex items-center w-full md:w-64 flex-shrink-0">
                      <StatusTimeline currentStatus={app.status} />
                    </div>
                    
                    <div className="flex gap-3 w-full md:w-auto mt-4 md:mt-0">
                      {app.resume_url && (
                        <a href={app.resume_url} target="_blank" rel="noreferrer" title="View Resume" className="flex-none">
                          <Button variant="outline" className="h-12 w-12 p-0 rounded-xl border-2 border-border shadow-sm hover:-translate-y-1 hover:shadow-md hover:border-primary transition-all duration-300 group">
                            <Download size={20} className="text-muted-foreground group-hover:text-primary transition-colors" />
                          </Button>
                        </a>
                      )}
                      <Link href={`/jobs/${app.jobs?.id}`} className="flex-1 md:flex-none">
                        <Button className="w-full h-12 px-6 rounded-xl border-2 border-primary bg-primary text-primary-foreground font-bold shadow-[0_4px_0_0_rgba(11,27,61,1)] hover:shadow-[0_6px_0_0_rgba(11,27,61,1)] hover:-translate-y-1 transition-all duration-300 flex items-center justify-center">
                          View Details <ChevronRight size={18} className="ml-2" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 px-4">
              <div className="w-24 h-24 bg-muted/50 rounded-full mx-auto flex items-center justify-center mb-6 border-2 border-dashed border-border">
                <Briefcase size={40} className="text-muted-foreground" />
              </div>
              <h3 className="font-heading font-extrabold text-2xl mb-2">No applications found</h3>
              <p className="text-muted-foreground font-medium text-lg mb-8 max-w-md mx-auto">
                You haven't applied to any jobs yet. Start your job search today and land your dream role!
              </p>
              <Button asChild className="h-14 px-10 rounded-xl border-2 border-primary bg-primary text-primary-foreground font-bold shadow-[0_4px_14px_0_rgba(11,27,61,0.39)] hover:shadow-[0_6px_20px_rgba(11,27,61,0.23)] hover:-translate-y-1 transition-all duration-300 text-lg">
                <Link href="/jobs">Browse Jobs Now</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
