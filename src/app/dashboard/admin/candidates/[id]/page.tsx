"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { Loader2, ArrowLeft, User, Mail, Phone, MapPin, Download, FileText, CheckCircle2, Briefcase, GraduationCap, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { getAdminCandidateDetailAction } from "@/actions/admin/users";

export default function AdminCandidateDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [candidate, setCandidate] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCandidate() {
      if (!params.id) return;

      const result = await getAdminCandidateDetailAction(params.id as string);

      if (result.success && result.data) {
        const data = result.data;
        setCandidate(data);
        if (data?.candidate_profiles && data.candidate_profiles.length > 0) {
          setProfile(data.candidate_profiles[0]);
        } else if (data?.candidate_profiles && !Array.isArray(data.candidate_profiles)) {
          setProfile(data.candidate_profiles);
        }
      }
      setLoading(false);
    }

    fetchCandidate();
  }, [params.id]);

  const handleDownloadResume = async (url: string, name: string) => {
    // Determine the full URL. Older records might just have 'userId/filename'
    const downloadUrl = url.startsWith('/') || url.startsWith('http') 
      ? url 
      : `/uploads/candidate-resumes/${url}`;
      
    const a = document.createElement('a');
    a.href = downloadUrl;
    a.target = '_blank';
    a.download = `${name.replace(/\s+/g, '_')}_Resume.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  if (loading) {
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <Loader2 className="animate-spin text-primary" size={40} />
      </div>
    );
  }

  if (!candidate) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">Candidate not found</h2>
        <Button onClick={() => router.push('/dashboard/admin/candidates')}>Back to Candidates</Button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in duration-500 pb-12">
      <Link href="/dashboard/admin/candidates" className="inline-flex items-center text-sm font-semibold text-muted-foreground hover:text-primary transition-colors">
        <ArrowLeft size={16} className="mr-1" /> Back to Candidates
      </Link>

      <div className="flex flex-col md:flex-row gap-8 items-start">
        {/* Main Content */}
        <div className="flex-1 space-y-6 w-full">
          {/* Header */}
          <div className="bg-white rounded-3xl p-8 border-2 border-border shadow-sm flex flex-col items-center sm:flex-row gap-6">
            <div className="w-24 h-24 rounded-full bg-primary/10 text-primary flex items-center justify-center font-extrabold text-4xl flex-shrink-0">
              {candidate.avatar ? (
                <img src={candidate.avatar} alt={candidate.full_name} className="w-full h-full object-cover rounded-full" />
              ) : (
                candidate.full_name?.charAt(0).toUpperCase() || candidate.email?.charAt(0).toUpperCase()
              )}
            </div>
            <div className="flex-1 text-center sm:text-left">
              <h1 className="text-3xl font-extrabold font-heading text-gray-900 mb-2">{candidate.full_name || 'No Name'}</h1>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-sm font-semibold text-gray-500 mb-4">
                <span className="flex items-center gap-1.5"><Mail size={16} /> {candidate.email}</span>
                {candidate.phone && <span className="flex items-center gap-1.5"><Phone size={16} /> {candidate.phone}</span>}
                {profile?.current_location && <span className="flex items-center gap-1.5"><MapPin size={16} /> {profile.current_location}</span>}
              </div>

              <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                <Badge variant="outline" className={`capitalize ${profile?.candidate_status === 'shortlisted' ? 'border-green-300 text-green-700 bg-green-50' :
                    profile?.candidate_status === 'rejected' ? 'border-red-300 text-red-700 bg-red-50' :
                      'border-amber-300 text-amber-700 bg-amber-50'
                  }`}>
                  {profile?.candidate_status || 'Pending'}
                </Badge>
                {profile?.resume_url && (
                  <Button variant="outline" className="font-bold border-2 border-border" onClick={() => handleDownloadResume(profile.resume_url!, candidate.full_name)}>
                    <Download size={16} className="mr-2" /> Download Resume
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Profile Details */}
          {profile && (
            <div className="bg-white rounded-3xl p-8 border-2 border-border shadow-sm space-y-8">
              {profile.bio && (
                <section>
                  <h3 className="text-lg font-bold text-gray-900 mb-2 flex items-center gap-2"><User size={20} className="text-primary" /> Professional Summary</h3>
                  <p className="text-gray-600 leading-relaxed text-sm whitespace-pre-wrap">{profile.bio}</p>
                </section>
              )}

              {profile.skills && profile.skills.length > 0 && (
                <section>
                  <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2"><CheckCircle2 size={20} className="text-primary" /> Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {profile.skills.map((skill: string, index: number) => (
                      <span key={index} className="px-3 py-1 bg-gray-100 text-gray-700 font-semibold text-sm rounded-lg border border-gray-200">
                        {skill}
                      </span>
                    ))}
                  </div>
                </section>
              )}

              {profile.experience && profile.experience.length > 0 && (
                <section>
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2"><Briefcase size={20} className="text-primary" /> Work Experience</h3>
                  <div className="space-y-6">
                    {profile.experience.map((exp: any, index: number) => (
                      <div key={index} className="pl-4 border-l-2 border-primary/30 relative before:absolute before:-left-[5px] before:top-1.5 before:w-2 before:h-2 before:rounded-full before:bg-primary">
                        <h4 className="font-bold text-gray-900">{exp.title}</h4>
                        <p className="text-sm font-semibold text-primary mb-1">{exp.company}</p>
                        <p className="text-xs text-gray-500 font-medium mb-2">{exp.startDate} - {exp.current ? 'Present' : exp.endDate}</p>
                        {exp.description && <p className="text-sm text-gray-600 leading-relaxed">{exp.description}</p>}
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {profile.education && profile.education.length > 0 && (
                <section>
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2"><GraduationCap size={20} className="text-primary" /> Education</h3>
                  <div className="space-y-4">
                    {profile.education.map((edu: any, index: number) => (
                      <div key={index} className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                        <h4 className="font-bold text-gray-900">{edu.degree} in {edu.fieldOfStudy}</h4>
                        <p className="text-sm font-semibold text-gray-700">{edu.institution}</p>
                        <p className="text-xs text-gray-500 font-medium mt-1">Graduated: {edu.graduationYear || 'N/A'}</p>
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </div>
          )}
        </div>

        {/* Sidebar / Applications */}
        <div className="w-full md:w-80 flex-shrink-0 space-y-6">
          <div className="bg-white rounded-3xl p-6 border-2 border-border shadow-sm sticky top-6">
            <h3 className="font-bold text-lg mb-6 border-b-2 border-border pb-2 flex items-center gap-2">
              <FileText className="text-primary" size={20} /> Applications ({candidate.applications?.length || 0})
            </h3>

            <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
              {candidate.applications && candidate.applications.length > 0 ? (
                candidate.applications.map((app: any) => (
                  <div key={app.id} className="p-4 border-2 border-border rounded-xl bg-gray-50">
                    <Link href={`/dashboard/admin/jobs/${app.jobs?.id}`} className="font-bold text-gray-900 hover:text-primary transition-colors line-clamp-1 mb-1">
                      {app.jobs?.title}
                    </Link>
                    <p className="text-xs font-semibold text-gray-500 mb-2">
                      {app.jobs?.companies && !Array.isArray(app.jobs.companies) ? app.jobs.companies.name : 'Unknown'}
                    </p>
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="text-[10px] capitalize bg-white">{app.status || 'Applied'}</Badge>
                      <span className="text-[10px] text-gray-400 font-medium flex items-center gap-1">
                        <Clock size={10} /> {new Date(app.applied_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-6 text-sm text-gray-500 font-medium">
                  No applications yet.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
