"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useAction } from "next-safe-action/hooks";
import { Check, ChevronRight, Loader2 } from "lucide-react";

import { candidateProfileSchema, type CandidateProfileInput } from "@/lib/validations/candidate";
import { updateCandidateProfileAction } from "@/actions/candidate";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";

import { BasicInfoStep } from "./steps/BasicInfoStep";
import { ProfessionalStep } from "./steps/ProfessionalStep";
import { EducationSkillsStep } from "./steps/EducationSkillsStep";
import { ResumeUploadStep } from "./steps/ResumeUploadStep";
import { CompletionStep } from "./steps/CompletionStep";

const steps = [
  { id: "basic", title: "Basic Info" },
  { id: "professional", title: "Professional" },
  { id: "education", title: "Education & Skills" },
  { id: "resume", title: "Resume Upload" },
  { id: "completion", title: "Complete Profile" },
];

export function ProfileWizard({ initialData }: { initialData: Partial<CandidateProfileInput> }) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const form = useForm<CandidateProfileInput>({
    resolver: zodResolver(candidateProfileSchema),
    defaultValues: {
      headline: initialData.headline || "",
      bio: initialData.bio || "",
      phone: initialData.phone || "",
      date_of_birth: initialData.date_of_birth || "",
      gender: initialData.gender || undefined,
      city: initialData.city || "",
      state: initialData.state || "",
      country: initialData.country || "",
      experience_level: initialData.experience_level || "Entry Level",
      current_company: initialData.current_company || "",
      current_position: initialData.current_position || "",
      current_salary: initialData.current_salary || "",
      expected_salary: initialData.expected_salary || "",
      notice_period: initialData.notice_period || "",
      education: initialData.education || [],
      skills: initialData.skills || [],
      languages: initialData.languages || [],
      portfolio_url: initialData.portfolio_url || "",
      linkedin_url: initialData.linkedin_url || "",
      github_url: initialData.github_url || "",
      website: initialData.website || "",
      profile_image: initialData.profile_image || "",
      resume_url: initialData.resume_url || "",
    },
    mode: "onTouched",
  });

  const { execute, isExecuting } = useAction(updateCandidateProfileAction, {
    onSuccess: ({ data }) => {
      if (data?.success) {
        toast.success("Profile saved successfully!");
        if (currentStepIndex === steps.length - 2) {
          nextStep(); // Move to completion step
        }
      }
    },
    onError: ({ error }) => {
      toast.error(error.serverError || "Failed to save profile.");
    }
  });

  const nextStep = async () => {
    // Validate current step fields before moving on
    let fieldsToValidate: any[] = [];
    if (currentStepIndex === 0) {
      fieldsToValidate = ['headline', 'phone', 'city', 'country'];
    } else if (currentStepIndex === 1) {
      fieldsToValidate = ['experience_level'];
    } else if (currentStepIndex === 2) {
      fieldsToValidate = ['skills'];
    }
    
    const isValid = await form.trigger(fieldsToValidate);
    
    if (isValid && currentStepIndex < steps.length - 1) {
      if (currentStepIndex === steps.length - 2) {
        // If we are at Resume step and clicking Next, we should Submit
        form.handleSubmit(onSubmit)();
      } else {
        setDirection(1);
        setCurrentStepIndex(i => i + 1);
      }
    }
  };

  const prevStep = () => {
    if (currentStepIndex > 0) {
      setDirection(-1);
      setCurrentStepIndex(i => i - 1);
    }
  };

  const onSubmit = (values: CandidateProfileInput) => {
    execute(values);
  };

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 50 : -50,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 50 : -50,
      opacity: 0,
    }),
  };

  return (
    <div className="bg-white rounded-[2rem] border border-border shadow-md p-8 md:p-10 relative overflow-hidden">
      
      {/* Stepper Header */}
      <div className="flex items-center justify-between mb-10 relative">
        <div className="absolute top-1/2 left-0 w-full h-1 bg-border -translate-y-1/2 -z-10 rounded-full"></div>
        <div 
          className="absolute top-1/2 left-0 h-1 bg-primary -translate-y-1/2 -z-10 rounded-full transition-all duration-500"
          style={{ width: `${(currentStepIndex / (steps.length - 1)) * 100}%` }}
        ></div>
        
        {steps.map((step, index) => (
          <div key={step.id} className="flex flex-col items-center gap-2 bg-white px-2">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm border-2 transition-colors duration-300 ${
              index < currentStepIndex 
                ? "bg-primary border-primary text-primary-foreground" 
                : index === currentStepIndex 
                  ? "border-primary text-primary" 
                  : "border-border text-muted-foreground bg-muted/30"
            }`}>
              {index < currentStepIndex ? <Check size={18} strokeWidth={3} /> : index + 1}
            </div>
            <span className={`text-xs font-bold hidden md:block ${index <= currentStepIndex ? 'text-foreground' : 'text-muted-foreground'}`}>
              {step.title}
            </span>
          </div>
        ))}
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="min-h-[400px] relative">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={currentStepIndex}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="w-full"
              >
                {currentStepIndex === 0 && <BasicInfoStep form={form} />}
                {currentStepIndex === 1 && <ProfessionalStep form={form} />}
                {currentStepIndex === 2 && <EducationSkillsStep form={form} />}
                {currentStepIndex === 3 && <ResumeUploadStep form={form} />}
                {currentStepIndex === 4 && <CompletionStep form={form} />}
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="flex justify-between items-center mt-12 pt-6 border-t-2 border-border">
            <Button
              type="button"
              variant="outline"
              onClick={prevStep}
              disabled={currentStepIndex === 0 || currentStepIndex === steps.length - 1}
              className={`border border-border shadow-sm font-bold h-12 px-6 rounded-xl ${currentStepIndex === 0 || currentStepIndex === steps.length - 1 ? 'opacity-0 pointer-events-none' : ''}`}
            >
              Back
            </Button>
            
            {currentStepIndex < steps.length - 1 && (
              <Button
                type="button"
                onClick={nextStep}
                disabled={isExecuting}
                className="border border-border bg-primary text-primary-foreground shadow-md hover-lift font-bold h-12 px-8 rounded-xl"
              >
                {isExecuting ? <Loader2 className="animate-spin mr-2" size={18} /> : null}
                {currentStepIndex === steps.length - 2 ? "Complete Profile" : "Next Step"}
                {currentStepIndex !== steps.length - 2 && <ChevronRight size={18} className="ml-2" />}
              </Button>
            )}
          </div>
        </form>
      </Form>
    </div>
  );
}
