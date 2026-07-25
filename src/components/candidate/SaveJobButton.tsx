"use client";

import { useState } from "react";
import { Bookmark } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { toggleSavedJobAction } from "@/actions/candidate";
import { useAction } from "next-safe-action/hooks";
import { useRouter } from "next/navigation";

interface SaveJobButtonProps {
  jobId: string;
  initialIsSaved: boolean;
}

export function SaveJobButton({ jobId, initialIsSaved }: SaveJobButtonProps) {
  const [isSaved, setIsSaved] = useState(initialIsSaved);
  const router = useRouter();

  const { execute, isExecuting } = useAction(toggleSavedJobAction, {
    onSuccess: ({ data }) => {
      if (data) {
        setIsSaved(data.saved);
        if (data.saved) {
          toast.success("Job saved successfully!");
        } else {
          toast.info("Job removed from saved list.");
        }
        router.refresh();
      }
    },
    onError: ({ error }) => {
      toast.error(error.serverError || "Failed to toggle saved status.");
    },
  });

  return (
    <Button 
      variant={isSaved ? "default" : "outline"} 
      onClick={() => execute({ job_id: jobId })}
      disabled={isExecuting}
      className={`h-14 px-6 rounded-2xl font-bold shadow-md text-lg flex items-center gap-2 transition-all duration-300 ${
        isSaved 
          ? "bg-primary text-primary-foreground border-2 border-primary hover:bg-primary/90 hover:shadow-lg" 
          : "bg-white/10 backdrop-blur-md border-2 border-white text-white hover:bg-white hover:text-primary hover:scale-105"
      }`}
    >
      <Bookmark 
        size={20} 
        fill={isSaved ? "currentColor" : "none"} 
        className={`transition-all duration-300 ${isExecuting ? 'animate-pulse' : ''} ${isSaved ? 'text-accent' : ''}`}
      />
      {isSaved ? "Saved" : "Save Job"}
    </Button>
  );
}
