"use client";

import { CheckCircle2, Loader2, CloudOff } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type AutosaveState = "idle" | "saving" | "saved" | "error";

export function AutosaveIndicator({ state, lastSaved }: { state: AutosaveState; lastSaved?: string }) {
  return (
    <div className="flex items-center gap-2 text-sm font-semibold">
      <AnimatePresence mode="wait">
        {state === "saving" && (
          <motion.div
            key="saving"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="flex items-center gap-1.5 text-muted-foreground"
          >
            <Loader2 size={16} className="animate-spin" />
            <span>Saving...</span>
          </motion.div>
        )}
        {state === "saved" && (
          <motion.div
            key="saved"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="flex items-center gap-1.5 text-green-600"
          >
            <CheckCircle2 size={16} />
            <span>Saved {lastSaved && `at \${lastSaved}`}</span>
          </motion.div>
        )}
        {state === "error" && (
          <motion.div
            key="error"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="flex items-center gap-1.5 text-red-600"
          >
            <CloudOff size={16} />
            <span>Failed to save</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
