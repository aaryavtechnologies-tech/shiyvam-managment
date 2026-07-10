import Link from "next/link";
import { MapPin, Briefcase, DollarSign, Clock, Building, Bookmark, BookmarkCheck } from "lucide-react";
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
  const timeText = daysAgo === 0 ? 'Today' : `\${daysAgo}d ago`;

  return (
    <div className="bg-white rounded-3xl border-2 border-border shadow-md hover:-translate-y-1 hover:shadow-lg transition-all p-6 relative group">
      {onSave && (
        <button 
          onClick={(e) => { e.preventDefault(); onSave(job.id); }}
          className="absolute top-6 right-6 w-10 h-10 bg-muted/50 rounded-full flex items-center justify-center hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
        >
          {isSaved ? <BookmarkCheck className="text-primary fill-primary" size={20} /> : <Bookmark size={20} />}
        </button>
      )}

      <div className="flex gap-4 items-start mb-6 pr-12">
        <div className="w-16 h-16 rounded-xl border-2 border-border overflow-hidden bg-muted flex-shrink-0 flex items-center justify-center font-bold text-xl text-muted-foreground">
          {job.companies?.logo_url ? (
            <img src={job.companies.logo_url} alt={job.companies?.name} className="w-full h-full object-cover" />
          ) : (
            job.companies?.name?.charAt(0) || "C"
          )}
        </div>
        <div>
          <h3 className="font-heading font-extrabold text-xl mb-1 line-clamp-1 group-hover:text-primary transition-colors">
            <Link href={`/jobs/\${job.id}`} className="before:absolute before:inset-0">
              {job.title}
            </Link>
          </h3>
          <p className="font-semibold text-muted-foreground flex items-center gap-2">
            <Building size={16} />
            {job.companies?.name || "Unknown Company"}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-blue-50 text-blue-700 font-bold text-sm border-2 border-blue-200">
          <MapPin size={14} /> {job.location || "Remote"}
        </span>
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-green-50 text-green-700 font-bold text-sm border-2 border-green-200">
          <Briefcase size={14} /> {job.employment_type || "Full-time"}
        </span>
        {job.salary_range_min && (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-amber-50 text-amber-700 font-bold text-sm border-2 border-amber-200">
            <DollarSign size={14} /> {job.salary_range_min/1000}k - {job.salary_range_max/1000}k {job.currency}
          </span>
        )}
      </div>

      <div className="flex items-center justify-between mt-4 pt-4 border-t-2 border-border/50">
        <div className="flex items-center gap-2 text-sm font-bold text-muted-foreground">
          <Clock size={16} />
          {timeText}
        </div>
        <Button className="border border-border shadow-sm rounded-xl font-bold px-6 bg-primary text-primary-foreground hover:bg-primary z-10 relative">
          View Job
        </Button>
      </div>
    </div>
  );
}
