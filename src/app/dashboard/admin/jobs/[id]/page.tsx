"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Loader2, ArrowLeft, Building, MapPin, Briefcase, DollarSign, Clock, Users, GraduationCap, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function AdminJobDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [job, setJob] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchJob() {
      if (!params.id) return;
      
      const supabase = createClient();
      const { data, error } = await supabase
        .from("jobs")
        .select(`
          *,
          companies (*),
          applications (id)
        `)
        .eq("id", params.id)
        .single();
        
      if (data) {
        setJob(data);
      }
      setLoading(false);
    }
    
    fetchJob();
  }, [params.id]);

  if (loading) {
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <Loader2 className="animate-spin text-primary" size={40} />
      </div>
    );
  }

  if (!job) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">Job not found</h2>
        <Button onClick={() => router.push('/dashboard/admin/jobs')}>Back to Jobs</Button>
      </div>
    );
  }

  const statusColor = 
    job.admin_status === 'approved' ? 'bg-green-100 text-green-800 border-green-200' :
    job.admin_status === 'rejected' ? 'bg-red-100 text-red-800 border-red-200' :
    'bg-amber-100 text-amber-800 border-amber-200';

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in duration-500 pb-12">
      <Link href="/dashboard/admin/jobs" className="inline-flex items-center text-sm font-semibold text-muted-foreground hover:text-primary transition-colors">
        <ArrowLeft size={16} className="mr-1" /> Back to Jobs
      </Link>

      <div className="flex flex-col md:flex-row gap-8 items-start">
        {/* Main Content */}
        <div className="flex-1 space-y-6 w-full">
          <div className="bg-white rounded-3xl p-8 border-2 border-border shadow-sm">
            <div className="flex items-start justify-between gap-4 mb-6">
              <div>
                <h1 className="text-3xl font-extrabold font-heading text-gray-900 mb-2">{job.title}</h1>
                <div className="flex flex-wrap items-center gap-4 text-sm font-semibold text-gray-500">
                  <span className="flex items-center gap-1.5"><Building size={16} /> {job.companies?.name || 'Unknown Company'}</span>
                  <span className="flex items-center gap-1.5"><MapPin size={16} /> {job.location || 'Remote'}</span>
                  <span className="flex items-center gap-1.5"><Clock size={16} /> {new Date(job.created_at).toLocaleDateString()}</span>
                </div>
              </div>
              <div className={`px-3 py-1 rounded-full text-xs font-bold border-2 uppercase tracking-wide ${statusColor}`}>
                {job.admin_status || 'Pending'}
              </div>
            </div>

            <div className="space-y-8">
              {job.description && (
                <section>
                  <h3 className="text-xl font-bold mb-3 flex items-center gap-2"><FileText size={20} className="text-primary"/> Job Description</h3>
                  <div className="prose prose-sm max-w-none text-gray-600 leading-relaxed whitespace-pre-wrap">
                    {job.description}
                  </div>
                </section>
              )}

              {job.requirements && (
                <section>
                  <h3 className="text-xl font-bold mb-3">Requirements</h3>
                  <div className="prose prose-sm max-w-none text-gray-600 leading-relaxed whitespace-pre-wrap">
                    {job.requirements}
                  </div>
                </section>
              )}

              {job.benefits && (
                <section>
                  <h3 className="text-xl font-bold mb-3">Benefits</h3>
                  <div className="prose prose-sm max-w-none text-gray-600 leading-relaxed whitespace-pre-wrap">
                    {job.benefits}
                  </div>
                </section>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar / Quick Info */}
        <div className="w-full md:w-80 flex-shrink-0 space-y-6">
          <div className="bg-white rounded-3xl p-6 border-2 border-border shadow-sm sticky top-6">
            <h3 className="font-bold text-lg mb-6 border-b-2 border-border pb-2">Quick Info</h3>
            
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-blue-50 text-blue-600 rounded-xl"><DollarSign size={20} /></div>
                <div>
                  <p className="text-sm font-semibold text-gray-500">Salary Range</p>
                  <p className="font-bold text-gray-900">
                    {job.salary_range_min ? `${job.salary_range_min/1000}k` : 'Not specified'} 
                    {job.salary_range_max ? ` - ${job.salary_range_max/1000}k` : ''} {job.currency}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 bg-green-50 text-green-600 rounded-xl"><Briefcase size={20} /></div>
                <div>
                  <p className="text-sm font-semibold text-gray-500">Employment Type</p>
                  <p className="font-bold text-gray-900">{job.employment_type || 'Full-time'}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 bg-purple-50 text-purple-600 rounded-xl"><Users size={20} /></div>
                <div>
                  <p className="text-sm font-semibold text-gray-500">Applicants</p>
                  <p className="font-bold text-gray-900">{job.applications?.length || 0} applied</p>
                </div>
              </div>

              {job.education_requirement && (
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-orange-50 text-orange-600 rounded-xl"><GraduationCap size={20} /></div>
                  <div>
                    <p className="text-sm font-semibold text-gray-500">Education</p>
                    <p className="font-bold text-gray-900">{job.education_requirement}</p>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-8 pt-6 border-t-2 border-border flex flex-col gap-3">
              <Link href={`/dashboard/admin/companies/${job.company_id}`}>
                <Button variant="outline" className="w-full font-bold border-2">View Company</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
