import { UseFormReturn } from "react-hook-form";
import { PartyPopper, ArrowRight } from "lucide-react";
import Link from "next/link";
import { CandidateProfileInput } from "@/lib/validations/candidate";

export function CompletionStep({ form }: { form: UseFormReturn<CandidateProfileInput> }) {
  const values = form.getValues();
  
  // Calculate completion percentage manually for display
  let score = 0;
  const fields: (keyof CandidateProfileInput)[] = ['headline', 'phone', 'city', 'country', 'experience_level', 'resume_url'];
  fields.forEach(field => {
    if (values[field] && (values[field] as string).length > 0) score += 10;
  });
  if (values.skills && values.skills.length > 0) score += 20;
  if (values.education && values.education.length > 0) score += 20;
  
  const completion = Math.min(score, 100);

  return (
    <div className="flex flex-col items-center justify-center text-center space-y-6 py-10">
      <div className="w-24 h-24 bg-primary text-primary-foreground rounded-full flex items-center justify-center border border-border shadow-md mb-4 animate-bounce">
        <PartyPopper size={48} />
      </div>
      
      <h2 className="text-4xl font-extrabold font-heading text-foreground">You're All Set!</h2>
      <p className="text-xl text-muted-foreground font-medium max-w-md">
        Your profile is looking great. You are now ready to start applying for your dream jobs.
      </p>

      <div className="bg-white border-2 border-border shadow-sm rounded-[2rem] p-8 w-full max-w-md my-8">
        <div className="flex items-center justify-between mb-4">
          <span className="font-bold text-lg">Profile Strength</span>
          <span className="font-extrabold text-primary text-2xl">{completion}%</span>
        </div>
        <div className="h-4 bg-muted/50 rounded-full overflow-hidden border-2 border-border">
          <div 
            className="h-full bg-primary transition-all duration-1000 ease-out"
            style={{ width: `\${completion}%` }}
          ></div>
        </div>
        {completion < 100 && (
          <p className="text-sm font-bold text-muted-foreground mt-4">
            💡 Add more details (like your resume or skills) to reach 100%!
          </p>
        )}
      </div>

      <Link 
        href="/jobs"
        className="inline-flex h-14 items-center justify-center px-10 border border-border shadow-md hover-lift rounded-2xl font-bold text-lg bg-foreground text-background hover:bg-foreground transition-all"
      >
        Browse Jobs
        <ArrowRight size={20} className="ml-2" />
      </Link>
    </div>
  );
}
