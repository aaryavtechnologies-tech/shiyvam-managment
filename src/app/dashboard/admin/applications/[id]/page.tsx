import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Download, ExternalLink, Calendar, Mail, Phone, MapPin, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ApplicationStatusUpdater } from "@/app/dashboard/employer/applications/[id]/_components/status-updater";

export default async function AdminApplicationDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  const appId = resolvedParams.id;

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");
  
  // Verify Admin
  const { data: userData } = await supabase.from("users").select("role").eq("id", user.id).single();
  if (userData?.role !== "admin") redirect("/dashboard");

  const supabaseAdmin = createAdminClient();

  const { data: application } = await supabaseAdmin
    .from("applications")
    .select(`
      *,
      job:jobs (id, title, employer_id),
      candidate:users!applications_candidate_id_fkey (id, email, raw_user_meta_data)
    `)
    .eq("id", appId)
    .single();

  if (!application) {
    return (
      <div className="p-8 text-center">
        <h1 className="text-2xl font-bold">Application not found</h1>
        <p className="text-muted-foreground mt-2">This application does not exist.</p>
        <Link href="/dashboard/admin/applications">
          <Button className="mt-4">Back to Applications</Button>
        </Link>
      </div>
    );
  }

  const appData = application as any;
  const meta = appData.candidate?.raw_user_meta_data || {};
  const name = `${meta.first_name || ''} ${meta.last_name || ''}`.trim() || 'Unknown Candidate';
  
  let resumeUrl = null;
  if (appData.resume_url) {
    // If it's a full URL or local path, use it directly, otherwise assume it's just the filename
    if (appData.resume_url.startsWith('http') || appData.resume_url.startsWith('/')) {
      resumeUrl = appData.resume_url;
    } else {
      resumeUrl = `/uploads/candidate-resumes/${appData.resume_url}`;
    }
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-6xl mx-auto pb-12">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/admin/applications">
          <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl hover:bg-white hover:shadow-sm border-2 border-transparent hover:border-border transition-all">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="font-heading text-2xl font-black tracking-tight">{name}'s Application</h1>
          <p className="text-muted-foreground font-medium text-sm">
            Applied for <Link href={`/dashboard/admin/jobs/${appData.job.id}`} className="font-bold text-secondary hover:underline">{appData.job.title}</Link> • {new Date(appData.created_at).toLocaleDateString()}
          </p>
        </div>
        <div className="ml-auto">
          <ApplicationStatusUpdater appId={appId} currentStatus={appData.status || 'Applied'} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Candidate Info */}
        <div className="space-y-6">
          <Card className="p-6 border-2 border-border shadow-md rounded-2xl bg-white">
            <h2 className="text-lg font-black font-heading mb-4">Candidate Profile</h2>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-2xl bg-secondary text-secondary-foreground flex items-center justify-center font-heading font-black text-2xl border-2 border-border shadow-sm">
                {name.charAt(0)}
              </div>
              <div>
                <h3 className="font-bold text-lg">{name}</h3>
                <p className="text-sm font-medium text-muted-foreground">{meta.title || 'Professional'}</p>
              </div>
            </div>

            <div className="space-y-3 text-sm font-medium">
              <div className="flex items-center gap-3 text-muted-foreground">
                <Mail className="h-4 w-4" />
                <a href={`mailto:${appData.candidate.email}`} className="text-foreground hover:underline">{appData.candidate.email}</a>
              </div>
              {meta.phone && (
                <div className="flex items-center gap-3 text-muted-foreground">
                  <Phone className="h-4 w-4" />
                  <span className="text-foreground">{meta.phone}</span>
                </div>
              )}
              {meta.location && (
                <div className="flex items-center gap-3 text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span className="text-foreground">{meta.location}</span>
                </div>
              )}
              <div className="flex items-center gap-3 text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span className="text-foreground">Applied {new Date(appData.created_at).toLocaleDateString()}</span>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t-2 border-border space-y-3">
              <Link href={`/dashboard/admin/candidates/${appData.candidate.id}`} className="block">
                <Button className="w-full font-bold">View Full Profile</Button>
              </Link>
            </div>
          </Card>
        </div>

        {/* Right Column: Resume Viewer */}
        <Card className="lg:col-span-2 border-2 border-border shadow-md rounded-2xl bg-white overflow-hidden flex flex-col h-[800px]">
          <div className="p-4 border-b-2 border-border bg-muted/20 flex justify-between items-center">
            <h2 className="text-lg font-black font-heading">Resume / CV</h2>
            {resumeUrl && (
              <a href={resumeUrl} target="_blank" rel="noreferrer">
                <Button variant="outline" size="sm" className="h-9 rounded-lg border-2 border-border font-bold gap-2 bg-white shadow-sm hover:-translate-y-0.5 transition-transform">
                  <Download className="h-4 w-4" /> Download PDF
                </Button>
              </a>
            )}
          </div>
          <div className="flex-1 bg-muted/30 p-4">
            {resumeUrl ? (
              <iframe 
                src={`${resumeUrl}#view=FitH`} 
                className="w-full h-full border-2 border-border rounded-xl bg-white"
                title="Resume PDF"
              />
            ) : (
              <div className="w-full h-full border-2 border-dashed border-border rounded-xl flex flex-col items-center justify-center text-muted-foreground bg-white">
                <FileText className="h-16 w-16 mb-4 text-muted-foreground/30" />
                <p className="font-bold text-lg">No resume attached</p>
                <p className="text-sm font-medium max-w-sm text-center mt-2">This candidate did not upload a resume file during their application process.</p>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
