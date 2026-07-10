"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { User, Building2, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export default function RoleSelectionPage() {
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState<"candidate" | "employer" | null>(null);

  const handleContinue = () => {
    if (selectedRole) {
      // Pass the selected role to the registration page
      router.push(`/register?role=\${selectedRole}`);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-8"
    >
      <div className="text-center">
        <span className="bg-primary/10 text-primary font-bold px-4 py-1.5 rounded-full text-sm inline-block mb-4">
          Step 1 of 7
        </span>
        <h1 className="text-3xl md:text-4xl font-heading font-extrabold tracking-tight mb-3">
          Join Shivyam Management Services
        </h1>
        <p className="text-muted-foreground font-medium text-lg">
          To get started, please tell us how you plan to use the platform.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {/* Candidate Option */}
        <button
          onClick={() => setSelectedRole("candidate")}
          className={`relative flex flex-col items-center text-center p-8 rounded-2xl border-2 transition-all duration-200 shadow-sm \${
            selectedRole === "candidate"
              ? "border-primary bg-primary/5 ring-4 ring-primary/20 scale-[1.02]"
              : "border-border bg-white hover:border-primary/50 hover:bg-muted/30"
          }`}
        >
          <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 border-2 \${
            selectedRole === "candidate" ? "bg-primary text-primary-foreground border-primary" : "bg-muted text-muted-foreground border-border"
          }`}>
            <User size={32} />
          </div>
          <h3 className="font-bold text-xl mb-2">I am a Candidate</h3>
          <p className="text-muted-foreground font-medium text-sm">
            I'm looking for government jobs, private sector opportunities, and exam preparations.
          </p>
        </button>

        {/* Employer Option */}
        <button
          onClick={() => setSelectedRole("employer")}
          className={`relative flex flex-col items-center text-center p-8 rounded-2xl border-2 transition-all duration-200 shadow-sm \${
            selectedRole === "employer"
              ? "border-secondary bg-secondary/5 ring-4 ring-secondary/20 scale-[1.02]"
              : "border-border bg-white hover:border-secondary/50 hover:bg-muted/30"
          }`}
        >
          <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 border-2 \${
            selectedRole === "employer" ? "bg-secondary text-secondary-foreground border-secondary" : "bg-muted text-muted-foreground border-border"
          }`}>
            <Building2 size={32} />
          </div>
          <h3 className="font-bold text-xl mb-2">I am an Employer</h3>
          <p className="text-muted-foreground font-medium text-sm">
            I represent a company or government body looking to hire top talent.
          </p>
        </button>
      </div>

      <div className="pt-6">
        <button
          onClick={handleContinue}
          disabled={!selectedRole}
          className={`w-full h-14 rounded-xl font-bold text-lg flex items-center justify-center transition-all border-2 \${
            selectedRole
              ? "bg-foreground text-background border-foreground shadow-md hover:-translate-y-1 hover:shadow-lg"
              : "bg-muted text-muted-foreground border-border cursor-not-allowed"
          }`}
        >
          Continue
          <ArrowRight className="ml-2" size={20} />
        </button>
      </div>
    </motion.div>
  );
}
