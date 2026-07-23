import { Navbar } from "@/components/home/Navbar";
import { Footer } from "@/components/home/Footer";
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { MapPin, Globe, Building2, Briefcase, ExternalLink, CalendarDays } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function CompanyDetailsPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const supabase = await createClient();

  // Fetch company details
  const { data, error: companyError } = await supabase
    .from("companies")
    .select("*")
    .eq("id", params.id)
    .single();

  const company = data as any;

  if (companyError || !company) {
    notFound();
  }

  // Fetch active jobs for this company
  const { data: jobsData, error: jobsError } = await supabase
    .from("jobs")
    .select("id, title, location, employment_type, created_at, status")
    .eq("company_id", company.id)
    .eq("status", "Active")
    .order("created_at", { ascending: false });

  const jobs = jobsData as any[] | null;

  return (
    <main className="min-h-screen bg-muted/10 flex flex-col">
      <Navbar />

      {/* HERO BANNER & HEADER */}
      <div className="relative pt-32">
        {/* Cover Image/Gradient */}
        <div className="absolute inset-0 top-32 h-64 bg-gradient-to-r from-primary/20 via-primary/10 to-transparent border-b-2 border-border -z-10" />
        
        <div className="container mx-auto px-4 md:px-6 pt-24 pb-8">
          <div className="bg-white border-2 border-border rounded-[2.5rem] shadow-md p-8 md:p-12 relative -mt-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
              
              <div className="w-32 h-32 md:w-40 md:h-40 rounded-[2rem] border-4 border-white bg-muted shadow-sm flex items-center justify-center flex-shrink-0 overflow-hidden relative -mt-20 md:-mt-24 z-10">
                {company.logo_url ? (
                  <img src={company.logo_url} alt={company.name} className="w-full h-full object-cover" />
                ) : (
                  <Building2 size={48} className="text-muted-foreground" />
                )}
              </div>
              
              <div className="text-center md:text-left flex-1">
                <h1 className="font-heading text-4xl md:text-5xl font-extrabold uppercase mb-4 text-foreground tracking-tight">
                  {company.name}
                </h1>
                
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 text-muted-foreground font-bold">
                  {company.industry && (
                    <div className="flex items-center gap-1.5 px-4 py-1.5 bg-muted/50 border-2 border-border rounded-xl">
                      <Building2 size={16} />
                      {company.industry}
                    </div>
                  )}
                  {company.location && (
                    <div className="flex items-center gap-1.5 px-4 py-1.5 bg-muted/50 border-2 border-border rounded-xl">
                      <MapPin size={16} />
                      {company.location}
                    </div>
                  )}
                  {company.website && (
                    <a href={company.website.startsWith('http') ? company.website : `https://${company.website}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 px-4 py-1.5 bg-white border-2 border-border rounded-xl hover:text-primary hover:border-primary hover:-translate-y-0.5 transition-all shadow-sm">
                      <Globe size={16} />
                      Website
                      <ExternalLink size={12} className="ml-0.5" />
                    </a>
                  )}
                </div>
              </div>

              <div className="w-full md:w-auto flex flex-col items-center justify-center bg-primary/5 border-2 border-primary/20 rounded-3xl p-6 min-w-[200px]">
                <p className="text-sm font-bold text-primary/80 uppercase tracking-widest mb-1">Open Roles</p>
                <p className="font-heading text-5xl font-extrabold text-primary">{jobs ? jobs.length : 0}</p>
              </div>

            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 container mx-auto px-4 md:px-6 py-8 pb-20">
        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* LEFT: About Company */}
          <div className="lg:col-span-1 space-y-8 animate-in fade-in slide-in-from-left-8 duration-700 delay-100">
            <div className="bg-white border-2 border-border rounded-[2rem] p-8 shadow-sm sticky top-32">
              <h2 className="font-heading text-2xl font-extrabold mb-6 flex items-center gap-3 border-b-2 border-border pb-4">
                About Company
              </h2>
              {company.description ? (
                <div className="prose prose-lg max-w-none text-muted-foreground font-medium leading-relaxed whitespace-pre-wrap">
                  {company.description}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-muted-foreground bg-muted/30 rounded-2xl border-2 border-dashed border-border">
                  <Building2 size={32} className="mb-2 opacity-50" />
                  <p className="italic font-medium text-center px-4">No description provided yet.</p>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT: Jobs List */}
          <div className="lg:col-span-2 animate-in fade-in slide-in-from-right-8 duration-700 delay-200">
            <div className="flex items-center justify-between mb-8">
              <h2 className="font-heading text-3xl font-extrabold flex items-center gap-3">
                <Briefcase size={28} className="text-primary" />
                Open Positions
              </h2>
              {jobs && jobs.length > 0 && (
                <span className="bg-primary text-primary-foreground font-bold px-4 py-1.5 rounded-full text-sm shadow-sm">
                  {jobs.length} Jobs
                </span>
              )}
            </div>

            {jobs && jobs.length > 0 ? (
              <div className="grid gap-5">
                {jobs.map((job) => (
                  <Link 
                    href={`/jobs/${job.id}`} 
                    key={job.id} 
                    className="group relative bg-white border-2 border-border rounded-[2rem] p-6 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6"
                  >
                    <div className="absolute top-0 left-0 w-2 h-full bg-border group-hover:bg-primary transition-colors" />
                    <div className="pl-4">
                      <h3 className="font-heading text-2xl font-extrabold group-hover:text-primary transition-colors mb-3">
                        {job.title}
                      </h3>
                      <div className="flex flex-wrap gap-4 text-sm font-bold text-muted-foreground">
                        <span className="flex items-center gap-1.5 bg-muted px-3 py-1 rounded-xl">
                          <MapPin size={14} /> {job.location}
                        </span>
                        <span className="flex items-center gap-1.5 bg-muted px-3 py-1 rounded-xl">
                          <Briefcase size={14} /> {job.employment_type}
                        </span>
                        <span className="flex items-center gap-1.5 bg-muted px-3 py-1 rounded-xl">
                          <CalendarDays size={14} /> {new Date(job.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    
                    <Button className="border-2 border-transparent font-bold md:flex-shrink-0 group-hover:bg-primary group-hover:text-primary-foreground group-hover:shadow-sm transition-all h-12 px-8 rounded-xl bg-muted text-foreground">
                      View Job
                    </Button>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="p-16 text-center border-2 border-border border-dashed rounded-[2.5rem] bg-white shadow-sm">
                <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
                  <Briefcase className="h-10 w-10 text-muted-foreground" />
                </div>
                <h3 className="font-heading text-2xl font-extrabold mb-3">No open positions</h3>
                <p className="text-muted-foreground font-medium text-lg">Check back later for new opportunities at {company.name}.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
