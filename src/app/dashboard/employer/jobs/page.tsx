import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Plus, Search, MoreHorizontal, Edit, Trash2, Eye, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default async function EmployerJobsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const supabaseAdmin = createAdminClient();
  const { data: jobs } = await supabaseAdmin
    .from("jobs")
    .select("*")
    .eq("employer_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="font-heading text-3xl font-black tracking-tight">Job Postings</h1>
          <p className="text-muted-foreground font-medium mt-1">Manage your active jobs, drafts, and archives.</p>
        </div>
        <Link href="/dashboard/employer/jobs/new">
          <Button className="h-11 px-6 rounded-xl border border-border bg-secondary text-secondary-foreground shadow-md hover:bg-secondary/90 hover:-translate-y-0.5 hover:shadow-lg transition-all font-bold gap-2">
            <Plus size={18} />
            Post New Job
          </Button>
        </Link>
      </div>

      <Card className="border-2 border-border shadow-md rounded-2xl overflow-hidden bg-white">
        <div className="p-4 border-b-2 border-border bg-muted/20 flex flex-col sm:flex-row justify-between gap-4">
          <div className="relative max-w-md w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <Input 
              placeholder="Search jobs by title or location..."
              className="pl-10 h-11 border-2 border-border rounded-xl focus-visible:ring-secondary/20 font-medium bg-white"
            />
          </div>
          <div className="flex gap-2">
            <select className="h-11 px-4 border-2 border-border rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-secondary/20 bg-white">
              <option>All Status</option>
              <option>Active</option>
              <option>Draft</option>
              <option>Closed</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b-2 border-border bg-muted/10 text-muted-foreground font-bold">
                <th className="p-4 whitespace-nowrap">Job Title</th>
                <th className="p-4 whitespace-nowrap">Status</th>
                <th className="p-4 whitespace-nowrap">Location</th>
                <th className="p-4 whitespace-nowrap">Posted Date</th>
                <th className="p-4 whitespace-nowrap">Applications</th>
                <th className="p-4 whitespace-nowrap text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y-2 divide-border">
              {jobs && jobs.length > 0 ? jobs.map((jobRaw) => {
                const job = jobRaw as any;
                return (
                <tr key={job.id} className="hover:bg-muted/10 transition-colors font-medium group">
                  <td className="p-4">
                    <div className="font-bold text-foreground">{job.title}</div>
                    <div className="text-sm text-muted-foreground">{job.employment_type} • {job.work_mode || 'On-site'}</div>
                  </td>
                  <td className="p-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border-2 ${
                      job.status === 'Active' ? 'bg-green-100 text-green-800 border-green-200' :
                      job.status === 'Draft' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' :
                      'bg-gray-100 text-gray-800 border-gray-200'
                    }`}>
                      {job.status || 'Active'}
                    </span>
                  </td>
                  <td className="p-4 text-muted-foreground">{job.location}</td>
                  <td className="p-4 text-muted-foreground">
                    {new Date(job.created_at).toLocaleDateString()}
                  </td>
                  <td className="p-4">
                    <Link href={`/dashboard/employer/applications?job=${job.id}`} className="font-bold text-secondary hover:underline">
                      0 Candidates
                    </Link>
                  </td>
                  <td className="p-4 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg">
                          <MoreHorizontal className="h-5 w-5" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48 rounded-xl border-2 border-border shadow-sm font-medium">
                        <DropdownMenuItem className="cursor-pointer focus:bg-muted font-bold">
                          <Eye className="mr-2 h-4 w-4" /> View Public Page
                        </DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer focus:bg-muted font-bold">
                          <Edit className="mr-2 h-4 w-4" /> Edit Job
                        </DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer focus:bg-destructive/10 text-destructive focus:text-destructive font-bold">
                          <Trash2 className="mr-2 h-4 w-4" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              )}) : (
                <tr>
                  <td colSpan={6} className="p-12 text-center text-muted-foreground">
                    <div className="flex flex-col items-center justify-center space-y-3">
                      <Briefcase className="h-12 w-12 text-muted-foreground/30" />
                      <p className="font-bold text-lg">No jobs posted yet</p>
                      <Link href="/dashboard/employer/jobs/new">
                        <Button variant="outline" className="mt-2 rounded-xl border-2 border-border font-bold">Create your first job</Button>
                      </Link>
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
