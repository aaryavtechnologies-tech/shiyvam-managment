import Link from "next/link";
import { MapPin, Briefcase, DollarSign, Clock, Building, Bookmark, BookmarkCheck, ChevronRight, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Job {
  id: string;
  title: string;
  company_id: string;
  companies: { name: string; logo_url: string };
  location: string;
  employment_type: string;
  salary_range_min: number;
  salary_range_max: number;
  currency: string;
  created_at: string;
}

interface JobCardProps {
  job: Job;
  isSaved?: boolean;
  onSave?: (id: string) => void;
}

export function JobCard({ job, isSaved = false, onSave }: JobCardProps) {
  // Calculate days ago
  const daysAgo = Math.floor((new Date().getTime() - new Date(job.created_at).getTime()) / (1000 * 3600 * 24));
  const timeText = daysAgo === 0 ? 'Just posted' : `${daysAgo} days ago`;
  const isNew = daysAgo <= 3;

  return (
    <div className="group bg-white rounded-3xl border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300 p-6 sm:p-8 flex flex-col relative overflow-hidden">
      
      {/* Decorative background element */}
      <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-primary/5 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

      <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-6 relative z-10">
        
        {/* Logo and Titles */}
        <div className="flex gap-5 items-start w-full pr-12 sm:pr-0">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl border border-gray-100 overflow-hidden bg-white shadow-sm flex-shrink-0 flex items-center justify-center font-bold text-2xl text-gray-300 group-hover:border-primary/20 transition-colors">
            {job.companies?.logo_url ? (
              <img src={job.companies.logo_url} alt={job.companies?.name} className="w-full h-full object-cover" />
            ) : (
              job.companies?.name?.charAt(0) || "C"
            )}
          </div>
          
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-1">
              <h3 className="font-heading font-extrabold text-xl sm:text-2xl line-clamp-1 group-hover:text-primary transition-colors">
                <Link href={`/jobs/${job.id}`}>
                  {job.title}
                </Link>
              </h3>
              {isNew && (
                <span className="hidden sm:inline-flex items-center gap-1 bg-green-50 text-green-700 text-xs font-bold px-2 py-0.5 rounded-md uppercase tracking-wider">
                  <Zap size={12} className="fill-green-700" /> New
                </span>
              )}
            </div>
            
            <p className="font-semibold text-gray-500 flex items-center gap-2 text-sm sm:text-base mb-3">
              <Building size={16} className="text-gray-400" />
              {job.companies?.name || "Unknown Company"}
            </p>

            {/* Badges */}
            <div className="flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-gray-50 text-gray-600 font-semibold text-xs sm:text-sm border border-gray-100">
                <MapPin size={14} className="text-gray-400" /> {job.location || "Remote"}
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-indigo-50 text-indigo-700 font-semibold text-xs sm:text-sm border border-indigo-100">
                <Briefcase size={14} className="text-indigo-400" /> {job.employment_type || "Full-time"}
              </span>
              {job.salary_range_min && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-green-50 text-green-700 font-semibold text-xs sm:text-sm border border-green-100">
                  <DollarSign size={14} className="text-green-400" /> {job.salary_range_min/1000}k - {job.salary_range_max/1000}k {job.currency}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Save Button */}
        {onSave && (
          <button 
            onClick={(e) => { e.preventDefault(); onSave(job.id); }}
            className="absolute top-0 right-0 sm:relative sm:top-auto sm:right-auto w-10 h-10 bg-gray-50 hover:bg-gray-100 rounded-full flex items-center justify-center transition-colors text-gray-400 hover:text-gray-600 shadow-sm"
            aria-label="Save Job"
          >
            {isSaved ? <BookmarkCheck className="text-primary fill-primary" size={20} /> : <Bookmark size={20} />}
          </button>
        )}
      </div>

      {/* Footer / Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mt-auto pt-6 border-t border-gray-50 gap-5 relative z-10">
        <div className="flex items-center gap-2 text-sm font-semibold text-gray-400">
          <Clock size={16} />
          {timeText}
        </div>
        
        <div className="flex flex-row items-center gap-3 w-full sm:w-auto">
          <Link 
            href={`/jobs/${job.id}`}
            className="flex-1 sm:flex-none inline-flex items-center justify-center border-2 border-gray-200 text-slate-700 bg-white hover:bg-slate-50 hover:text-slate-900 shadow-sm rounded-xl font-bold h-12 px-6 transition-all"
          >
            View Details
          </Link>
          <Link 
            href={`/jobs/${job.id}/apply`} 
            className="flex-1 sm:flex-none inline-flex items-center justify-center border border-primary shadow-[0_4px_14px_0_rgb(var(--primary)/30%)] hover:shadow-[0_6px_20px_rgb(var(--primary)/40%)] hover:-translate-y-0.5 transition-all rounded-xl font-bold px-8 h-12 bg-primary text-white group/btn"
          >
            Apply Now
            <ChevronRight size={18} className="ml-2 group-hover/btn:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
}
