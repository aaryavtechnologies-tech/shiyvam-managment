"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAction } from "next-safe-action/hooks";
import { toast } from "sonner";
import { FileText, Loader2, UploadCloud, X } from "lucide-react";

import { applicationSchema, type ApplicationInput } from "@/lib/validations/candidate";
import { applyForJobAction } from "@/actions/candidate";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export function ApplyModal({ jobId, jobTitle, children }: { jobId: string, jobTitle: string, children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  
  const form = useForm<ApplicationInput>({
    resolver: zodResolver(applicationSchema),
    defaultValues: {
      job_id: jobId,
      cover_letter: "",
      resume_url: "", // In a real app, this would be fetched from the candidate profile as default
    },
  });

  const { execute, isExecuting } = useAction(applyForJobAction, {
    onSuccess: ({ data }) => {
      if (data?.success) {
        toast.success("Application submitted successfully!");
        setOpen(false);
        form.reset();
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
    <Dialog open={open} onOpenChange={setOpen}>
      <span onClick={() => setOpen(true)} style={{ display: "contents" }}>
        {children}
      </span>
      <DialogContent className="sm:max-w-[600px] border border-border shadow-md rounded-3xl p-8">
        <DialogHeader className="mb-6">
          <DialogTitle className="font-heading text-3xl font-extrabold">Apply for {jobTitle}</DialogTitle>
          <DialogDescription className="font-medium text-base text-muted-foreground">
            Submit your application. Make sure your resume is up to date!
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            
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
                           <p className="text-xs text-green-600 font-medium">From your profile</p>
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
                        <p className="font-bold">Click to use your profile resume</p>
                        <p className="text-sm text-muted-foreground mt-1">(Simulation for demo purposes)</p>
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
                  <FormLabel className="font-bold text-lg">Cover Letter (Optional)</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Why are you a good fit for this role?" 
                      className="resize-none border-2 rounded-xl focus-visible:ring-primary focus-visible:border-primary shadow-sm min-h-[150px] p-4"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-4 mt-8 pt-6 border-t-2 border-border">
              <Button type="button" variant="outline" onClick={() => setOpen(false)} className="border border-border shadow-sm rounded-xl font-bold h-12 px-6">
                Cancel
              </Button>
              <Button type="submit" disabled={isExecuting} className="border border-border shadow-md rounded-xl font-bold h-12 px-8 bg-primary text-primary-foreground hover:bg-primary hover-lift">
                {isExecuting ? <Loader2 className="animate-spin mr-2" size={20} /> : null}
                Submit Application
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
