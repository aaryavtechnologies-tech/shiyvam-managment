"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm, useWatch } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowLeft, Check, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";

import { ProgressBar } from "@/components/onboarding/ProgressBar";
import { AutosaveIndicator } from "@/components/onboarding/AutosaveIndicator";
import { saveEmployerProgress, finishEmployerOnboarding } from "@/actions/onboarding/save-employer";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type EmployerFormData = {
  name: string;
  industry: string;
  website: string;
  location: string;
  company_size: string;
  description: string;
  mission: string;
  remote_policy: string;
  logo_url: string;
  cover_image_url: string;
};

export default function EmployerOnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1); // Internal steps 1 to 4, representing flow steps 3 to 6
  const totalSteps = 4;
  
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [lastSaved, setLastSaved] = useState<string>();

  const form = useForm<EmployerFormData>({
    defaultValues: {
      name: "",
      industry: "",
      website: "",
      location: "",
      company_size: "",
      description: "",
      mission: "",
      remote_policy: "",
      logo_url: "",
      cover_image_url: "",
    }
  });

  const formValues = useWatch({ control: form.control });
  
  useEffect(() => {
    const hasValues = Object.values(formValues).some(v => v !== "");
    if (!hasValues) return;

    setSaveState("saving");
    const timer = setTimeout(async () => {
      try {
        const res = await saveEmployerProgress(formValues, step + 2); 
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

  const handleNext = async () => {
    if (step < totalSteps) {
      setStep(s => s + 1);
    } else {
      const res = await finishEmployerOnboarding();
      if (res.success) {
        toast.success("Company Profile completed successfully!");
        router.refresh();
        router.push("/dashboard/employer");
      } else {
        toast.error("Failed to complete onboarding.");
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
            {step === 1 && "Company Information"}
            {step === 2 && "Company Culture & Details"}
            {step === 3 && "Brand Assets"}
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
                  <Label className="font-bold">Company Name</Label>
                  <Input 
                    {...form.register("name")} 
                    placeholder="e.g. Acme Corp" 
                    className="h-12 rounded-xl border-2 border-border shadow-sm"
                  />
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label className="font-bold">Industry</Label>
                    <select 
                      {...form.register("industry")} 
                      className="h-12 px-3 rounded-xl border-2 border-border shadow-sm bg-white font-medium focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="">Select Industry...</option>
                      <option value="tech">Technology / Software</option>
                      <option value="finance">Finance / Banking</option>
                      <option value="gov">Government / PSU</option>
                      <option value="education">Education</option>
                    </select>
                  </div>
                  <div className="grid gap-2">
                    <Label className="font-bold">Company Size</Label>
                    <select 
                      {...form.register("company_size")} 
                      className="h-12 px-3 rounded-xl border-2 border-border shadow-sm bg-white font-medium focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="">Select Size...</option>
                      <option value="1-10">1-10 Employees</option>
                      <option value="11-50">11-50 Employees</option>
                      <option value="51-200">51-200 Employees</option>
                      <option value="200+">200+ Employees</option>
                    </select>
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label className="font-bold">Headquarters / Location</Label>
                  <Input 
                    {...form.register("location")} 
                    placeholder="e.g. Mumbai, India" 
                    className="h-12 rounded-xl border-2 border-border shadow-sm"
                  />
                </div>
                <div className="grid gap-2">
                  <Label className="font-bold">Website</Label>
                  <Input 
                    {...form.register("website")} 
                    placeholder="https://acmecorp.com" 
                    className="h-12 rounded-xl border-2 border-border shadow-sm"
                  />
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <div className="grid gap-2">
                  <Label className="font-bold">About the Company</Label>
                  <textarea 
                    {...form.register("description")} 
                    placeholder="Describe what your company does and what makes it special..." 
                    className="min-h-[120px] p-3 rounded-xl border-2 border-border shadow-sm w-full focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary font-medium"
                  />
                </div>
                <div className="grid gap-2">
                  <Label className="font-bold">Mission Statement</Label>
                  <Input 
                    {...form.register("mission")} 
                    placeholder="e.g. To organize the world's information" 
                    className="h-12 rounded-xl border-2 border-border shadow-sm"
                  />
                </div>
                <div className="grid gap-2">
                  <Label className="font-bold">Remote Policy</Label>
                  <select 
                    {...form.register("remote_policy")} 
                    className="h-12 px-3 rounded-xl border-2 border-border shadow-sm bg-white font-medium focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="">Select Policy...</option>
                    <option value="office">On-Site / Office Only</option>
                    <option value="hybrid">Hybrid</option>
                    <option value="remote">Fully Remote</option>
                  </select>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  {/* Company Logo Upload */}
                  <div className="relative">
                    <input 
                      type="file" 
                      accept="image/png, image/jpeg" 
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        
                        // Fake visual update
                        const btn = e.currentTarget.parentElement;
                        if (btn) btn.setAttribute('data-state', 'uploading');
                        
                        const formData = new FormData();
                        formData.append("file", file);
                        
                        toast.loading("Uploading logo...", { id: "logo-upload" });
                        import("@/actions/onboarding/save-employer").then(async ({ uploadCompanyAssetAction }) => {
                          const res = await uploadCompanyAssetAction(formData, 'logo');
                          if (res.success) {
                            form.setValue("logo_url" as any, res.url);
                            toast.success("Logo uploaded!", { id: "logo-upload" });
                            if (btn) btn.setAttribute('data-state', 'success');
                          } else {
                            toast.error(res.error || "Failed to upload logo", { id: "logo-upload" });
                            if (btn) btn.setAttribute('data-state', 'idle');
                          }
                        });
                      }}
                    />
                    <div 
                      data-state="idle"
                      className="border-2 border-dashed border-border rounded-2xl p-6 text-center bg-muted/20 hover:bg-muted/50 transition-colors group data-[state=uploading]:animate-pulse data-[state=success]:border-green-500 data-[state=success]:bg-green-50 overflow-hidden"
                    >
                      {formValues.logo_url ? (
                        <div className="w-24 h-24 mx-auto mb-4 relative rounded-xl overflow-hidden border-2 border-border shadow-sm">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={formValues.logo_url} alt="Logo preview" className="w-full h-full object-cover" />
                        </div>
                      ) : (
                        <div className="w-12 h-12 bg-white border-2 border-border rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform group-data-[state=success]:border-green-500">
                          <ImageIcon size={24} className="text-secondary group-data-[state=success]:hidden" />
                          <Check size={24} className="text-green-500 hidden group-data-[state=success]:block" />
                        </div>
                      )}
                      <h3 className="font-bold text-sm mb-1 group-data-[state=success]:text-green-700 group-data-[state=uploading]:text-muted-foreground">
                        <span className="block group-data-[state=uploading]:hidden group-data-[state=success]:hidden">Company Logo</span>
                        <span className="hidden group-data-[state=uploading]:block">Uploading...</span>
                        <span className="hidden group-data-[state=success]:block">Uploaded!</span>
                      </h3>
                      <p className="text-muted-foreground text-xs font-medium">1:1 Square (JPG/PNG)</p>
                    </div>
                  </div>

                  {/* Cover Image Upload */}
                  <div className="relative">
                    <input 
                      type="file" 
                      accept="image/png, image/jpeg" 
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        
                        const btn = e.currentTarget.parentElement;
                        if (btn) btn.setAttribute('data-state', 'uploading');
                        
                        const formData = new FormData();
                        formData.append("file", file);
                        
                        toast.loading("Uploading cover...", { id: "cover-upload" });
                        import("@/actions/onboarding/save-employer").then(async ({ uploadCompanyAssetAction }) => {
                          const res = await uploadCompanyAssetAction(formData, 'cover');
                          if (res.success) {
                            form.setValue("cover_image_url" as any, res.url);
                            toast.success("Cover uploaded!", { id: "cover-upload" });
                            if (btn) btn.setAttribute('data-state', 'success');
                          } else {
                            toast.error(res.error || "Failed to upload cover", { id: "cover-upload" });
                            if (btn) btn.setAttribute('data-state', 'idle');
                          }
                        });
                      }}
                    />
                    <div 
                      data-state="idle"
                      className="border-2 border-dashed border-border rounded-2xl p-6 text-center bg-muted/20 hover:bg-muted/50 transition-colors group data-[state=uploading]:animate-pulse data-[state=success]:border-green-500 data-[state=success]:bg-green-50 overflow-hidden"
                    >
                      {formValues.cover_image_url ? (
                        <div className="w-full h-24 mx-auto mb-4 relative rounded-xl overflow-hidden border-2 border-border shadow-sm">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={formValues.cover_image_url} alt="Cover preview" className="w-full h-full object-cover" />
                        </div>
                      ) : (
                        <div className="w-12 h-12 bg-white border-2 border-border rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform group-data-[state=success]:border-green-500">
                          <ImageIcon size={24} className="text-primary group-data-[state=success]:hidden" />
                          <Check size={24} className="text-green-500 hidden group-data-[state=success]:block" />
                        </div>
                      )}
                      <h3 className="font-bold text-sm mb-1 group-data-[state=success]:text-green-700 group-data-[state=uploading]:text-muted-foreground">
                        <span className="block group-data-[state=uploading]:hidden group-data-[state=success]:hidden">Cover Image</span>
                        <span className="hidden group-data-[state=uploading]:block">Uploading...</span>
                        <span className="hidden group-data-[state=success]:block">Uploaded!</span>
                      </h3>
                      <p className="text-muted-foreground text-xs font-medium">16:9 Landscape</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="space-y-6">
                <div className="bg-green-50 border-2 border-green-200 rounded-2xl p-6 text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Check size={32} className="text-green-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-green-900 mb-2">Company Profile Ready!</h3>
                  <p className="text-green-800 font-medium">Your brand is set up. Next, you can start posting jobs.</p>
                </div>
                
                <div className="border-2 border-border rounded-xl p-4">
                  <h4 className="font-bold text-sm text-muted-foreground uppercase mb-2">Company Summary</h4>
                  <p className="font-bold text-lg">{formValues.name || "No name provided"}</p>
                  <p className="text-muted-foreground font-medium mt-1">{formValues.industry || "No industry provided"} • {formValues.location || "No location provided"}</p>
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
