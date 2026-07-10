"use client";

import { CheckCircle2, Circle } from "lucide-react";
import { motion } from "framer-motion";

const STAGES = ["Applied", "Under Review", "Interviewing", "Offer", "Hired"];

export function StatusTimeline({ currentStatus }: { currentStatus: string }) {
  // Map the specific statuses to the broader stages
  let currentIndex = 0;
  
  if (["Rejected", "Withdrawn"].includes(currentStatus)) {
    return (
      <div className={`px-4 py-1.5 rounded-lg font-bold text-sm border-2 shadow-sm whitespace-nowrap \${
        currentStatus === 'Rejected' 
          ? 'bg-red-50 text-red-700 border-red-200' 
          : 'bg-muted text-muted-foreground border-border'
      }`}>
        {currentStatus}
      </div>
    );
  }

  if (currentStatus === "Applied") currentIndex = 0;
  else if (["Under Review", "Shortlisted"].includes(currentStatus)) currentIndex = 1;
  else if (["Interview Scheduled", "Interviewed", "Interviewing"].includes(currentStatus)) currentIndex = 2;
  else if (currentStatus === "Offer Sent") currentIndex = 3;
  else if (currentStatus === "Hired") currentIndex = 4;

  return (
    <div className="flex items-center w-full max-w-sm mt-2 md:mt-0">
      {STAGES.map((stage, index) => {
        const isCompleted = index <= currentIndex;
        const isCurrent = index === currentIndex;
        const isLast = index === STAGES.length - 1;

        return (
          <div key={stage} className={`flex items-center \${isLast ? '' : 'flex-1'}`}>
            <div className="relative group flex flex-col items-center">
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: isCurrent ? 1.1 : 1 }}
                className={`flex items-center justify-center rounded-full \${
                  isCompleted ? "text-primary" : "text-muted-foreground/30"
                }`}
              >
                {isCompleted ? <CheckCircle2 size={18} className="fill-primary text-white" /> : <Circle size={14} strokeWidth={3} />}
              </motion.div>
              
              {/* Tooltip on hover */}
              <div className="absolute -bottom-8 opacity-0 group-hover:opacity-100 transition-opacity bg-black text-white text-xs font-bold px-2 py-1 rounded whitespace-nowrap z-10 pointer-events-none">
                {stage}
              </div>
            </div>
            
            {!isLast && (
              <div className={`h-[2px] flex-1 mx-1 \${index < currentIndex ? "bg-primary" : "bg-muted-foreground/20"}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}
