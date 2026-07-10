import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { redirect } from "next/navigation";
import { Search, Filter, Download, Eye, MoreHorizontal, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default async function ApplicationsPage({
  searchParams,
}: {
  searchParams: Promise<{ job?: string; status?: string }>;
}) {
  const params = await searchParams;
  const jobId = params.job;
  const statusFilter = params.status;

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const supabaseAdmin = createAdminClient();

  // Fetch employer's jobs for the filter
  const { data: jobs } = await supabaseAdmin
    .from("jobs")
    .select("id, title")
    .eq("employer_id", user.id);

  // Fetch applications
  let query = supabaseAdmin
    .from("applications")
    .select(`
      *,
      job:jobs (title),
      candidate:users!applications_candidate_id_fkey (raw_user_meta_data, email)
    `)
    .eq("jobs.employer_id", user.id);

  if (jobId) {
    query = query.eq("job_id", jobId);
  }
  
  if (statusFilter) {
    query = query.eq("status", statusFilter);
  }

  const { data: applications } = await query;

  // Filter out applications where job is null (meaning it didn't match the employer_id join condition if we did it as an inner join, but Supabase does left join by default for related tables)
  // To strictly enforce security, we ensure we only show applications for jobs owned by this employer
  const validApplications = applications?.filter(app => (app as any).job !== null) || [];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="font-heading text-3xl font-black tracking-tight">Applications</h1>
          <p className="text-muted-foreground font-medium mt-1">Review and manage candidates for your open roles.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="h-11 px-4 rounded-xl border-2 border-border font-bold gap-2 bg-white">
            <Download size={18} />
            Export CSV
          </Button>
        </div>
      </div>

      <Card className="border-2 border-border shadow-md rounded-2xl overflow-hidden bg-white">
        <div className="p-4 border-b-2 border-border bg-muted/20 flex flex-col md:flex-row justify-between gap-4">
          <div className="flex-1 flex gap-4 max-w-2xl">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <Input 
                placeholder="Search candidates by name or email..."
                className="pl-10 h-11 border-2 border-border rounded-xl focus-visible:ring-secondary/20 font-medium bg-white"
              />
            </div>
          </div>
          
          <div className="flex gap-3">
            <select 
              className="h-11 px-4 border-2 border-border rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-secondary/20 bg-white min-w-[150px]"
              defaultValue={jobId || ""}
            >
              <option value="">All Jobs</option>
              {jobs?.map(j => (
                <option key={j.id} value={j.id}>{j.title}</option>
              ))}
            </select>
            
            <select 
              className="h-11 px-4 border-2 border-border rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-secondary/20 bg-white min-w-[150px]"
              defaultValue={statusFilter || ""}
            >
              <option value="">All Statuses</option>
              <option value="Applied">Applied</option>
              <option value="Reviewing">Reviewing</option>
              <option value="Shortlisted">Shortlisted</option>
              <option value="Interview">Interview</option>
              <option value="Offer">Offer</option>
              <option value="Rejected">Rejected</option>
            </select>
            
            <Button variant="outline" size="icon" className="h-11 w-11 rounded-xl border-2 border-border bg-white shrink-0">
              <Filter size={18} />
            </Button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b-2 border-border bg-muted/10 text-muted-foreground font-bold">
                <th className="p-4 whitespace-nowrap">Candidate</th>
                <th className="p-4 whitespace-nowrap">Applied For</th>
                <th className="p-4 whitespace-nowrap">Status</th>
                <th className="p-4 whitespace-nowrap">Applied Date</th>
                <th className="p-4 whitespace-nowrap text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y-2 divide-border">
              {validApplications.length > 0 ? validApplications.map((appRaw) => {
                const app = appRaw as any;
                const meta = app.candidate?.raw_user_meta_data || {};
                const name = `${meta.first_name || ''} ${meta.last_name || ''}`.trim() || 'Unknown Candidate';
                
                return (
                  <tr key={app.id} className="hover:bg-muted/10 transition-colors font-medium group">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center font-bold border-2 border-border">
                          {name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-bold text-foreground">{name}</div>
                          <div className="text-sm text-muted-foreground">{app.candidate?.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 font-bold text-muted-foreground">
                      {app.job?.title || 'Unknown Job'}
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border-2 ${
                        app.status === 'Shortlisted' || app.status === 'Interview' ? 'bg-purple-100 text-purple-800 border-purple-200' :
                        app.status === 'Offer' || app.status === 'Hired' ? 'bg-green-100 text-green-800 border-green-200' :
                        app.status === 'Rejected' || app.status === 'Withdrawn' ? 'bg-red-100 text-red-800 border-red-200' :
                        'bg-blue-100 text-blue-800 border-blue-200'
                      }`}>
                        {app.status || 'Applied'}
                      </span>
                    </td>
                    <td className="p-4 text-muted-foreground">
                      {new Date(app.created_at).toLocaleDateString()}
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link href={`/dashboard/employer/applications/${app.id}`}>
                          <Button variant="outline" size="sm" className="h-8 rounded-lg border-2 border-border font-bold text-xs">
                            Review
                          </Button>
                        </Link>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48 rounded-xl border-2 border-border shadow-sm font-medium">
                            <DropdownMenuItem className="cursor-pointer focus:bg-muted font-bold">
                              <Eye className="mr-2 h-4 w-4" /> View Resume
                            </DropdownMenuItem>
                            <DropdownMenuItem className="cursor-pointer focus:bg-muted font-bold">
                              <MessageSquare className="mr-2 h-4 w-4" /> Add Note
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </td>
                  </tr>
                );
              }) : (
                <tr>
                  <td colSpan={5} className="p-12 text-center text-muted-foreground">
                    <div className="flex flex-col items-center justify-center space-y-3">
                      <Search className="h-12 w-12 text-muted-foreground/30" />
                      <p className="font-bold text-lg">No applications found</p>
                      <p className="text-sm">Try adjusting your filters or wait for candidates to apply.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
