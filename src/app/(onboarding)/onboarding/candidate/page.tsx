"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useForm, useWatch } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowLeft, Check, UploadCloud, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { createClient } from "@/lib/supabase/client";

import { ProgressBar } from "@/components/onboarding/ProgressBar";
import { AutosaveIndicator } from "@/components/onboarding/AutosaveIndicator";
import { saveCandidateProgress, finishCandidateOnboarding, uploadCandidateResumeAction } from "@/actions/onboarding/save-candidate";

// Simple UI Components for the wizard
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type CandidateFormData = {
  headline: string;
  bio: string;
  city: string;
  experience_level: string;
  expected_salary: string;
  skills: string; // Comma separated for now
  linkedin_url: string;
  resume_url: string;
};

export default function CandidateOnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1); // Internal steps 1 to 4, representing flow steps 3 to 6
  const totalSteps = 4;
  
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [lastSaved, setLastSaved] = useState<string>();
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<CandidateFormData>({
    defaultValues: {
      headline: "",
      bio: "",
      city: "",
      experience_level: "",
      expected_salary: "",
      skills: "",
      linkedin_url: "",
      resume_url: "",
    }
  });

  // Autosave logic
  const formValues = useWatch({ control: form.control });
  
  useEffect(() => {
    // Only autosave if the form is actually dirty or has some values
    const hasValues = Object.values(formValues).some(v => v !== "");
    if (!hasValues) return;

    setSaveState("saving");
    const timer = setTimeout(async () => {
      try {
        // Send to server action
        const res = await saveCandidateProgress(formValues, step + 2); // mapping internal step to DB step
        if (res.success) {
          setSaveState("saved");
          setLastSaved(res.timestamp);
        } else {
          setSaveState("error");
        }
      } catch (err) {
        setSaveState("error");
      }
    }, 1500);

    return () => clearTimeout(timer);
  }, [formValues, step]);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("File must be less than 5MB");
      return;
    }

    if (file.type !== "application/pdf") {
      toast.error("File must be a PDF");
      return;
    }

    setIsUploading(true);
    const toastId = toast.loading("Uploading resume...");

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await uploadCandidateResumeAction(formData);

      if (!res.success) throw new Error(res.error);

      form.setValue("resume_url", res.filePath!, { shouldDirty: true, shouldValidate: true });
      toast.success("Resume uploaded successfully!", { id: toastId });
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Failed to upload resume", { id: toastId });
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleNext = async () => {
    if (step < totalSteps) {
      setStep(s => s + 1);
    } else {
      // Finish Onboarding
      const res = await finishCandidateOnboarding();
      if (res.success) {
        toast.success("Profile completed successfully!");
        // refresh() tells Next.js to invalidate the server component cache
        // so the layout re-reads onboarding_completed = true from the DB
        router.refresh();
        router.push("/dashboard/candidate");
      } else {
        toast.error(res.error || "Failed to complete onboarding.");
      }
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(s => s - 1);
  };

  return (
    <div className="flex flex-col h-full relative">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold font-heading">
            {step === 1 && "Personal Information"}
            {step === 2 && "Professional Details"}
            {step === 3 && "Resume Upload"}
            {step === 4 && "Review Profile"}
          </h2>
          <p className="text-muted-foreground font-medium text-sm">
            Step {step + 2} of 6
          </p>
        </div>
        <AutosaveIndicator state={saveState} lastSaved={lastSaved} />
      </div>

      <div className="mb-8">
        <ProgressBar currentStep={step} totalSteps={totalSteps} />
      </div>

      {/* Form Content */}
      <div className="flex-1 overflow-y-auto pr-2 pb-24">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            {step === 1 && (
              <div className="space-y-4">
                <div className="grid gap-2">
                  <Label className="font-bold">Professional Headline</Label>
                  <Input 
                    {...form.register("headline")} 
                    placeholder="e.g. Senior Software Engineer at TechCorp" 
                    className="h-12 rounded-xl border-2 border-border shadow-sm"
                  />
                </div>
                <div className="grid gap-2">
                  <Label className="font-bold">Short Bio</Label>
                  <textarea 
                    {...form.register("bio")} 
                    placeholder="Tell us about your career goals and background..." 
                    className="min-h-[120px] p-3 rounded-xl border-2 border-border shadow-sm w-full focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary font-medium"
                  />
                </div>
                <div className="grid gap-2">
                  <Label className="font-bold">City / Location</Label>
                  <Input 
                    {...form.register("city")} 
                    placeholder="e.g. New Delhi, India" 
                    className="h-12 rounded-xl border-2 border-border shadow-sm"
                  />
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label className="font-bold">Experience Level</Label>
                    <select 
                      {...form.register("experience_level")} 
                      className="h-12 px-3 rounded-xl border-2 border-border shadow-sm bg-white font-medium focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="">Select Level...</option>
                      <option value="entry">Entry Level</option>
                      <option value="mid">Mid Level</option>
                      <option value="senior">Senior Level</option>
                      <option value="executive">Executive</option>
                    </select>
                  </div>
                  <div className="grid gap-2">
                    <Label className="font-bold">Expected Salary (LPA)</Label>
                    <Input 
                      {...form.register("expected_salary")} 
                      placeholder="e.g. 15 LPA" 
                      className="h-12 rounded-xl border-2 border-border shadow-sm"
                    />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label className="font-bold">Key Skills (Comma separated)</Label>
                  <Input 
                    {...form.register("skills")} 
                    placeholder="e.g. React, Node.js, Public Speaking" 
                    className="h-12 rounded-xl border-2 border-border shadow-sm"
                  />
                </div>
                <div className="grid gap-2">
                  <Label className="font-bold">LinkedIn URL</Label>
                  <Input 
                    {...form.register("linkedin_url")} 
                    placeholder="https://linkedin.com/in/yourprofile" 
                    className="h-12 rounded-xl border-2 border-border shadow-sm"
                  />
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4">
                <div 
                  className="border-2 border-dashed border-border rounded-2xl p-12 text-center bg-muted/20 hover:bg-muted/50 transition-colors cursor-pointer group"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <div className="w-16 h-16 bg-white border-2 border-border rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                    {isUploading ? <Loader2 size={32} className="text-primary animate-spin" /> : <UploadCloud size={32} className="text-primary" />}
                  </div>
                  <h3 className="font-bold text-lg mb-2">
                    {isUploading ? "Uploading..." : formValues.resume_url ? "Resume Uploaded" : "Upload your Resume"}
                  </h3>
                  <p className="text-muted-foreground text-sm font-medium mb-4">
                    {isUploading ? "Please wait while we upload your file..." : formValues.resume_url ? "Click to upload a different file (PDF only, max 5MB)" : "PDF only, max 5MB"}
                  </p>
                  <button type="button" disabled={isUploading} className={`bg-white border-2 border-border font-bold px-6 py-2 rounded-xl shadow-sm transition-transform ${isUploading ? 'opacity-50 cursor-not-allowed' : 'hover:-translate-y-0.5'}`}>
                    {isUploading ? "Uploading..." : formValues.resume_url ? "Change File" : "Select File"}
                  </button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="application/pdf"
                    onChange={handleFileUpload}
                  />
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="space-y-6">
                <div className="bg-green-50 border-2 border-green-200 rounded-2xl p-6 text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Check size={32} className="text-green-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-green-900 mb-2">Profile almost complete!</h3>
                  <p className="text-green-800 font-medium">Review your details and hit finish to go to your dashboard.</p>
                </div>
                
                <div className="border-2 border-border rounded-xl p-4">
                  <h4 className="font-bold text-sm text-muted-foreground uppercase mb-2">Summary</h4>
                  <p className="font-bold text-lg">{formValues.headline || "No headline provided"}</p>
                  <p className="text-muted-foreground font-medium mt-1">{formValues.city || "No location provided"}</p>
                </div>
                
                <div className="border-2 border-border rounded-xl p-4 flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-sm text-muted-foreground uppercase mb-1">Resume</h4>
                    <p className="font-bold">{formValues.resume_url ? "Resume attached securely" : "No resume uploaded"}</p>
                  </div>
                  {formValues.resume_url && (
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <Check size={20} className="text-green-600" />
                    </div>
                  )}
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Footer Navigation */}
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t-2 border-border flex items-center justify-between">
        <button 
          onClick={handleBack}
          disabled={step === 1}
          className={`font-bold px-6 py-3 rounded-xl transition-all \${step === 1 ? "opacity-50 cursor-not-allowed text-muted-foreground" : "hover:bg-muted text-foreground"}`}
        >
          <div className="flex items-center gap-2">
            <ArrowLeft size={18} /> Back
          </div>
        </button>

        <button 
          onClick={handleNext}
          className="font-bold px-8 py-3 rounded-xl border-2 border-primary bg-primary text-primary-foreground shadow-md hover:-translate-y-1 hover:shadow-lg transition-all"
        >
          <div className="flex items-center gap-2">
            {step === totalSteps ? "Finish Profile" : "Continue"} <ArrowRight size={18} />
          </div>
        </button>
      </div>

    </div>
  );
}
