"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAction } from "next-safe-action/hooks";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { FileText, Loader2, UploadCloud, X, Briefcase } from "lucide-react";

import { applicationSchema, type ApplicationInput } from "@/lib/validations/candidate";
import { applyForJobAction } from "@/actions/candidate";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

export function ApplyForm({ jobId, jobTitle, companyName }: { jobId: string, jobTitle: string, companyName: string }) {
  const router = useRouter();
  
  const form = useForm<ApplicationInput>({
    resolver: zodResolver(applicationSchema),
    defaultValues: {
      job_id: jobId,
      cover_letter: "",
      resume_url: "",
      expected_salary: "",
      notice_period: "",
      portfolio_url: "",
    },
  });

  const { execute, isExecuting } = useAction(applyForJobAction, {
    onSuccess: ({ data }) => {
      if (data?.success) {
        toast.success("Application submitted successfully!");
        router.push("/dashboard/candidate/applications");
      }
    },
    onError: ({ error }) => {
      toast.error(error.serverError || "Failed to submit application.");
    }
  });

  const onSubmit = (values: ApplicationInput) => {
    execute(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        
        <div className="bg-white rounded-3xl border-2 border-border shadow-md p-8">
          <h2 className="font-heading font-extrabold text-2xl mb-6 flex items-center gap-3">
            <Briefcase className="text-primary" />
            Resume & Cover Letter
          </h2>
          
          <div className="space-y-6">
            <FormField
              control={form.control}
              name="resume_url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold text-lg">Resume *</FormLabel>
                  <FormControl>
                    {field.value ? (
                       <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4 flex items-center gap-4 w-full">
                         <FileText className="text-green-600" size={24} />
                         <div className="flex-1 text-left truncate">
                           <p className="font-bold text-green-800 text-sm">Resume Selected</p>
                           <p className="text-xs text-green-600 font-medium">Ready to submit</p>
                         </div>
                         <button 
                           type="button" 
                           onClick={() => form.setValue("resume_url", "", { shouldValidate: true })}
                           className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-green-100 text-green-600 transition-colors"
                         >
                           <X size={18} strokeWidth={3} />
                         </button>
                       </div>
                    ) : (
                      <div className="border-2 border-dashed border-border rounded-xl p-8 text-center bg-muted/30 hover:bg-muted transition-colors cursor-pointer" onClick={() => form.setValue("resume_url", "https://example.com/resume.pdf", { shouldValidate: true })}>
                        <UploadCloud className="mx-auto mb-2 text-muted-foreground" size={32} />
                        <p className="font-bold text-lg mb-1">Upload your resume</p>
                        <p className="text-sm text-muted-foreground font-medium">Click to use your profile resume (Simulation)</p>
                      </div>
                    )}
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="cover_letter"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold text-lg">Cover Letter</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder={`Why are you a good fit for this role at \${companyName}?`}
                      className="resize-none border-2 rounded-xl focus-visible:ring-primary focus-visible:border-primary shadow-sm min-h-[150px] p-4 text-base"
                      {...field} 
                    />
                  </FormControl>
                  <p className="text-sm text-muted-foreground font-medium mt-2">Optional, but highly recommended.</p>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="bg-white rounded-3xl border-2 border-border shadow-md p-8">
          <h2 className="font-heading font-extrabold text-2xl mb-6">Additional Details</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="expected_salary"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold">Expected Salary</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. $100,000/yr" className="h-12 border-2 rounded-xl" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notice_period"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold">Notice Period</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. 2 Weeks" className="h-12 border-2 rounded-xl" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="portfolio_url"
              render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel className="font-bold">Portfolio / Website URL</FormLabel>
                  <FormControl>
                    <Input placeholder="https://..." className="h-12 border-2 rounded-xl" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={() => router.back()} className="border-2 border-border rounded-xl font-bold h-14 px-8 text-lg hover:bg-muted">
            Cancel
          </Button>
          <Button type="submit" disabled={isExecuting} className="border border-border shadow-md rounded-xl font-bold h-14 px-10 text-lg bg-primary text-primary-foreground hover:bg-primary hover-lift">
            {isExecuting ? <Loader2 className="animate-spin mr-2" size={24} /> : null}
            Submit Application
          </Button>
        </div>
      </form>
    </Form>
  );
}
