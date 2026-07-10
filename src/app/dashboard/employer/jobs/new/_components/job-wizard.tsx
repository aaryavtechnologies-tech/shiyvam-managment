"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowLeft, Save, Loader2, Check } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { createJobAction } from "@/actions/employer/jobs";

// A very simplified schema for the demo
const jobSchema = z.object({
  title: z.string().min(2, "Title is required"),
  department: z.string().min(2, "Department is required"),
  employment_type: z.string().min(2, "Employment type is required"),
  location: z.string().min(2, "Location is required"),
  work_mode: z.string().min(2, "Work mode is required"),
  description: z.string().min(10, "Description is required"),
  requirements: z.string().min(10, "Requirements are required"),
  salary_range: z.string().min(1, "Salary range is required"),
});

export function JobWizard({ employerId }: { employerId: string }) {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof jobSchema>>({
    resolver: zodResolver(jobSchema),
    defaultValues: {
      title: "",
      department: "",
      employment_type: "Full-time",
      location: "",
      work_mode: "On-site",
      description: "",
      requirements: "",
      salary_range: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof jobSchema>) => {
    setIsSubmitting(true);
    try {
      const res = await createJobAction(data);
      if (res.success) {
        toast.success("Job posted successfully!");
        router.push("/dashboard/employer/jobs");
      } else {
        toast.error(res.error || "Failed to post job");
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  const steps = [
    { id: 1, title: "Basic Details" },
    { id: 2, title: "Description" },
    { id: 3, title: "Preview" },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="font-heading text-3xl font-black tracking-tight">Post a New Job</h1>
        <p className="text-muted-foreground font-medium mt-1">Fill in the details to publish your job opening.</p>
      </div>

      {/* Progress Bar */}
      <div className="flex items-center justify-between relative mb-12">
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-muted/50 -z-10"></div>
        <div 
          className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-secondary -z-10 transition-all duration-300"
          style={{ width: `${((step - 1) / (steps.length - 1)) * 100}%` }}
        ></div>
        
        {steps.map((s) => (
          <div key={s.id} className="flex flex-col items-center gap-2">
            <div className={`w-10 h-10 rounded-full border-2 border-border shadow-sm flex items-center justify-center font-bold transition-colors ${
              step >= s.id ? 'bg-secondary text-secondary-foreground' : 'bg-white text-muted-foreground'
            }`}>
              {step > s.id ? <Check size={16} /> : s.id}
            </div>
            <span className={`text-sm font-bold ${step >= s.id ? 'text-foreground' : 'text-muted-foreground'}`}>
              {s.title}
            </span>
          </div>
        ))}
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)}>
        {/* Step 1: Basic Details */}
        {step === 1 && (
          <Card className="p-8 border-2 border-border shadow-md rounded-2xl space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="font-bold">Job Title</Label>
                <Input {...form.register("title")} placeholder="e.g. Senior Frontend Developer" className="h-12 border-2 border-border rounded-xl focus-visible:ring-secondary/20 font-medium" />
                {form.formState.errors.title && <p className="text-sm text-destructive font-bold">{form.formState.errors.title.message}</p>}
              </div>
              <div className="space-y-2">
                <Label className="font-bold">Department</Label>
                <Input {...form.register("department")} placeholder="e.g. Engineering" className="h-12 border-2 border-border rounded-xl focus-visible:ring-secondary/20 font-medium" />
                {form.formState.errors.department && <p className="text-sm text-destructive font-bold">{form.formState.errors.department.message}</p>}
              </div>
              <div className="space-y-2">
                <Label className="font-bold">Employment Type</Label>
                <select 
                  {...form.register("employment_type")}
                  className="flex h-12 w-full items-center justify-between rounded-xl border-2 border-border bg-transparent px-3 py-2 text-sm font-medium ring-offset-background focus:outline-none focus:ring-2 focus:ring-secondary/20"
                >
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Contract">Contract</option>
                  <option value="Freelance">Freelance</option>
                  <option value="Internship">Internship</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label className="font-bold">Work Mode</Label>
                <select 
                  {...form.register("work_mode")}
                  className="flex h-12 w-full items-center justify-between rounded-xl border-2 border-border bg-transparent px-3 py-2 text-sm font-medium ring-offset-background focus:outline-none focus:ring-2 focus:ring-secondary/20"
                >
                  <option value="On-site">On-site</option>
                  <option value="Hybrid">Hybrid</option>
                  <option value="Remote">Remote</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label className="font-bold">Location</Label>
                <Input {...form.register("location")} placeholder="e.g. San Francisco, CA" className="h-12 border-2 border-border rounded-xl focus-visible:ring-secondary/20 font-medium" />
              </div>
              <div className="space-y-2">
                <Label className="font-bold">Salary Range</Label>
                <Input {...form.register("salary_range")} placeholder="e.g. $100k - $150k" className="h-12 border-2 border-border rounded-xl focus-visible:ring-secondary/20 font-medium" />
              </div>
            </div>
          </Card>
        )}

        {/* Step 2: Description */}
        {step === 2 && (
          <Card className="p-8 border-2 border-border shadow-md rounded-2xl space-y-6">
            <div className="space-y-6">
              <div className="space-y-2">
                <Label className="font-bold">Job Description</Label>
                <p className="text-xs text-muted-foreground mb-2">Provide a detailed description of the role.</p>
                <textarea 
                  {...form.register("description")} 
                  className="w-full min-h-[200px] border-2 border-border rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-secondary/20 font-medium"
                  placeholder="We are looking for..."
                />
                {form.formState.errors.description && <p className="text-sm text-destructive font-bold">{form.formState.errors.description.message}</p>}
              </div>
              <div className="space-y-2">
                <Label className="font-bold">Requirements & Skills</Label>
                <textarea 
                  {...form.register("requirements")} 
                  className="w-full min-h-[150px] border-2 border-border rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-secondary/20 font-medium"
                  placeholder="- 3+ years experience&#10;- React proficiency..."
                />
                {form.formState.errors.requirements && <p className="text-sm text-destructive font-bold">{form.formState.errors.requirements.message}</p>}
              </div>
            </div>
          </Card>
        )}

        {/* Step 3: Preview */}
        {step === 3 && (
          <Card className="p-8 border-2 border-border shadow-md rounded-2xl">
            <div className="bg-muted/10 p-6 rounded-xl border-2 border-border space-y-6">
              <div>
                <h2 className="text-2xl font-black font-heading">{form.watch("title")}</h2>
                <div className="flex flex-wrap gap-2 mt-2">
                  <span className="bg-white border-2 border-border px-3 py-1 rounded-full text-sm font-bold shadow-sm">{form.watch("department")}</span>
                  <span className="bg-white border-2 border-border px-3 py-1 rounded-full text-sm font-bold shadow-sm">{form.watch("employment_type")}</span>
                  <span className="bg-white border-2 border-border px-3 py-1 rounded-full text-sm font-bold shadow-sm">{form.watch("work_mode")}</span>
                  <span className="bg-white border-2 border-border px-3 py-1 rounded-full text-sm font-bold shadow-sm">{form.watch("location")}</span>
                  <span className="bg-white border-2 border-border px-3 py-1 rounded-full text-sm font-bold shadow-sm">{form.watch("salary_range")}</span>
                </div>
              </div>
              
              <div>
                <h3 className="font-bold text-lg mb-2">Description</h3>
                <p className="whitespace-pre-wrap font-medium">{form.watch("description")}</p>
              </div>

              <div>
                <h3 className="font-bold text-lg mb-2">Requirements</h3>
                <p className="whitespace-pre-wrap font-medium">{form.watch("requirements")}</p>
              </div>
            </div>
          </Card>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between items-center mt-8 sticky bottom-8">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => setStep(s => Math.max(1, s - 1))}
            disabled={step === 1}
            className="h-12 px-6 rounded-xl border-2 border-border font-bold bg-white shadow-md hover:-translate-y-0.5 hover:shadow-md-md transition-all gap-2 disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-md"
          >
            <ArrowLeft size={18} /> Back
          </Button>
          
          {step < 3 ? (
            <Button 
              type="button" 
              onClick={async () => {
                // Validate current step before proceeding
                let isValid = false;
                if (step === 1) {
                  isValid = await form.trigger(["title", "department", "employment_type", "location", "work_mode", "salary_range"]);
                } else if (step === 2) {
                  isValid = await form.trigger(["description", "requirements"]);
                }
                
                if (isValid) setStep(s => s + 1);
              }}
              className="h-12 px-6 rounded-xl border border-border bg-secondary text-secondary-foreground shadow-md hover:bg-secondary/90 hover:-translate-y-0.5 hover:shadow-lg transition-all font-bold gap-2"
            >
              Continue <ArrowRight size={18} />
            </Button>
          ) : (
            <div className="flex gap-4">
              <Button 
                type="button" 
                variant="outline"
                className="h-12 px-6 rounded-xl border-2 border-border font-bold bg-white shadow-md hover:-translate-y-0.5 hover:shadow-md-md transition-all gap-2"
              >
                Save as Draft
              </Button>
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="h-12 px-8 rounded-xl border border-border bg-primary text-primary-foreground shadow-md hover:bg-primary/90 hover:-translate-y-0.5 hover:shadow-lg transition-all font-bold gap-2 text-lg"
              >
                {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                Publish Job
              </Button>
            </div>
          )}
        </div>
      </form>
    </div>
  );
}
