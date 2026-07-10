"use client";

import { motion } from "framer-motion";

export function ProgressBar({ currentStep, totalSteps }: { currentStep: number; totalSteps: number }) {
  const progress = Math.min(100, Math.max(0, (currentStep / totalSteps) * 100));

  return (
    <div className="w-full bg-muted/50 rounded-full h-2 overflow-hidden border-2 border-border/50">
      <motion.div 
        className="h-full bg-primary"
        initial={{ width: 0 }}
        animate={{ width: `\${progress}%` }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      />
    </div>
  );
}
