"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Loader2, ArrowLeft, Building, MapPin, Globe, Briefcase, Link as LinkIcon, FileText, CheckCircle2, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

export default function AdminCompanyDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [company, setCompany] = useState<any>(null);
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCompany() {
      if (!params.id) return;
      
      const supabase = createClient();
      
      // Fetch company details
      const { data: compData, error: compError } = await supabase
        .from("companies")
        .select(`
          *,
          users:employer_id (email, full_name, phone)
        `)
        .eq("id", params.id)
        .single();
        
      if (compData) {
        setCompany(compData);
        
        // Fetch jobs for this company
        const { data: jobsData } = await supabase
          .from("jobs")
          .select("id, title, status, admin_status, location, employment_type, created_at")
          .eq("company_id", compData.id)
          .order("created_at", { ascending: false });
          
        if (jobsData) {
          setJobs(jobsData);
        }
      }
      setLoading(false);
    }
    
    fetchCompany();
  }, [params.id]);

  if (loading) {
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <Loader2 className="animate-spin text-primary" size={40} />
      </div>
    );
  }

  if (!company) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">Company not found</h2>
        <Button onClick={() => router.push('/dashboard/admin/employers')}>Back to Employers</Button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in duration-500 pb-12">
      <Link href="/dashboard/admin/employers" className="inline-flex items-center text-sm font-semibold text-muted-foreground hover:text-primary transition-colors">
        <ArrowLeft size={16} className="mr-1" /> Back to Employers
      </Link>

      <div className="flex flex-col md:flex-row gap-8 items-start">
        {/* Main Content */}
        <div className="flex-1 space-y-6 w-full">
          {/* Company Header */}
          <div className="bg-white rounded-3xl p-8 border-2 border-border shadow-sm">
            <div className="flex items-center gap-6 mb-6">
              <div className="w-24 h-24 rounded-2xl border-2 border-border overflow-hidden bg-muted flex items-center justify-center flex-shrink-0">
                {company.logo_url ? (
                  <img src={company.logo_url} alt={company.name} className="w-full h-full object-cover" />
                ) : (
                  <Building size={40} className="text-muted-foreground" />
                )}
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <h1 className="text-3xl font-extrabold font-heading text-gray-900 mb-2">{company.name}</h1>
                    <div className="flex items-center gap-3 text-sm font-semibold text-gray-500">
                      {company.industry && <span className="flex items-center gap-1.5"><Briefcase size={16} /> {company.industry}</span>}
                      {company.location && <span className="flex items-center gap-1.5"><MapPin size={16} /> {company.location}</span>}
                    </div>
                  </div>
                  <div>
                    {company.verification_status === 'verified' ? (
                      <Badge className="bg-green-100 text-green-700 hover:bg-green-100"><CheckCircle2 size={14} className="mr-1"/> Verified</Badge>
                    ) : company.verification_status === 'rejected' ? (
                      <Badge className="bg-red-100 text-red-700 hover:bg-red-100"><ShieldAlert size={14} className="mr-1"/> Rejected</Badge>
                    ) : (
                      <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100"><FileText size={14} className="mr-1"/> Pending</Badge>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {company.description && (
              <div className="prose prose-sm max-w-none text-gray-600 leading-relaxed mb-6">
                <h3 className="text-lg font-bold text-gray-900 mb-2">About Company</h3>
                <p>{company.description}</p>
              </div>
            )}
            
            {company.website_url && (
              <div className="flex items-center gap-2 text-sm font-semibold">
                <Globe size={16} className="text-primary" />
                <a href={company.website_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                  {company.website_url}
                </a>
              </div>
            )}
          </div>

          {/* Jobs List */}
          <div className="bg-white rounded-3xl p-8 border-2 border-border shadow-sm">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2"><Briefcase className="text-primary" /> Jobs Posted ({jobs.length})</h3>
            
            <div className="space-y-4">
              {jobs.length > 0 ? jobs.map(job => (
                <div key={job.id} className="p-4 border-2 border-border rounded-xl flex items-center justify-between hover:bg-muted/20 transition-colors">
                  <div>
                    <h4 className="font-bold text-gray-900 mb-1">{job.title}</h4>
                    <div className="flex items-center gap-3 text-xs text-gray-500 font-medium">
                      <span>{job.location || 'Remote'}</span>
                      <span>•</span>
                      <span>{job.employment_type || 'Full-time'}</span>
                      <span>•</span>
                      <span>Posted {new Date(job.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className={job.admin_status === 'approved' ? 'text-green-600 border-green-200 bg-green-50' : 'text-amber-600 border-amber-200 bg-amber-50'}>
                      {job.admin_status || 'Pending'}
                    </Badge>
                    <Link href={`/dashboard/admin/jobs/${job.id}`}>
                      <Button variant="ghost" size="sm" className="font-bold text-primary">View</Button>
                    </Link>
                  </div>
                </div>
              )) : (
                <div className="text-center py-8 text-gray-500 font-medium bg-muted/30 rounded-xl">
                  No jobs posted yet.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar / Legal Info */}
        <div className="w-full md:w-80 flex-shrink-0 space-y-6">
          <div className="bg-white rounded-3xl p-6 border-2 border-border shadow-sm sticky top-6">
            <h3 className="font-bold text-lg mb-6 border-b-2 border-border pb-2">Legal & Contact Info</h3>
            
            <div className="space-y-4">
              <div>
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Employer Contact</p>
                <p className="font-semibold text-sm">{company.users?.full_name}</p>
                <p className="text-sm text-blue-600 break-all">{company.users?.email}</p>
                {company.users?.phone && <p className="text-sm text-gray-600">{company.users.phone}</p>}
              </div>

              <div className="pt-4 border-t border-border/50">
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">PAN Number</p>
                <p className="font-mono font-bold">{company.pan_number || 'N/A'}</p>
              </div>

              <div className="pt-4 border-t border-border/50">
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">GST Number</p>
                <p className="font-mono font-bold">{company.gst_number || 'N/A'}</p>
              </div>

              <div className="pt-4 border-t border-border/50">
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">CIN Number</p>
                <p className="font-mono font-bold break-all">{company.cin_number || 'N/A'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
