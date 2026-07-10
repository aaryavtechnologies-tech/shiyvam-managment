import { useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { Plus, X } from "lucide-react";
import { CandidateProfileInput } from "@/lib/validations/candidate";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import { SUGGESTED_SKILLS } from "@/lib/constants/suggestions";

export function EducationSkillsStep({ form }: { form: UseFormReturn<CandidateProfileInput> }) {
  const [skillInput, setSkillInput] = useState("");
  const skills = form.watch("skills") || [];

  const handleAddSkill = (e: React.KeyboardEvent | React.MouseEvent) => {
    if ((e.type === 'keydown' && (e as React.KeyboardEvent).key === 'Enter') || e.type === 'click') {
      e.preventDefault();
      const val = skillInput.trim();
      if (val && !skills.includes(val) && skills.length < 15) {
        form.setValue("skills", [...skills, val], { shouldValidate: true });
        setSkillInput("");
      }
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    form.setValue("skills", skills.filter(s => s !== skillToRemove), { shouldValidate: true });
  };

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold font-heading">Education & Skills</h2>
        <p className="text-muted-foreground font-medium">Highlight your qualifications and expertise.</p>
      </div>

      <div className="space-y-4">
        <FormLabel className="font-bold">Skills *</FormLabel>
        <div className="flex gap-2">
          <div className="flex-1">
            <Input
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              onKeyDown={handleAddSkill}
              list="skills-suggestions"
              placeholder="e.g. React, Python, Project Management (Press Enter to add)"
              className="h-12 border-2 rounded-xl focus-visible:ring-primary shadow-sm w-full"
            />
            <datalist id="skills-suggestions">
              {SUGGESTED_SKILLS.map(skill => (
                <option key={skill} value={skill} />
              ))}
            </datalist>
          </div>
          <Button 
            type="button" 
            onClick={handleAddSkill}
            className="h-12 rounded-xl border border-border bg-primary text-primary-foreground font-bold shadow-md hover-lift"
          >
            <Plus size={20} />
          </Button>
        </div>
        
        <div className="flex flex-wrap gap-2 mt-3 min-h-[40px]">
          {skills.length === 0 && (
            <span className="text-sm text-muted-foreground italic">No skills added yet. Add at least one.</span>
          )}
          {skills.map(skill => (
            <Badge key={skill} className="bg-secondary text-white border-2 border-border px-3 py-1 text-sm font-bold shadow-sm flex items-center gap-1 rounded-lg">
              {skill}
              <button 
                type="button" 
                onClick={() => handleRemoveSkill(skill)}
                className="ml-1 hover:text-red-300 transition-colors"
              >
                <X size={14} strokeWidth={3} />
              </button>
            </Badge>
          ))}
        </div>
        {form.formState.errors.skills && (
          <p className="text-sm font-medium text-destructive mt-1">{form.formState.errors.skills.message}</p>
        )}
      </div>

      <div className="pt-6 border-t-2 border-border">
        <h3 className="font-bold text-lg mb-4">Web Presence (Optional)</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="linkedin_url"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-bold">LinkedIn</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="https://linkedin.com/in/..." 
                    className="h-12 border-2 rounded-xl focus-visible:ring-primary shadow-sm"
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="portfolio_url"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-bold">Portfolio Website</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="https://myportfolio.com" 
                    className="h-12 border-2 rounded-xl focus-visible:ring-primary shadow-sm"
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="github_url"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-bold">GitHub</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="https://github.com/..." 
                    className="h-12 border-2 rounded-xl focus-visible:ring-primary shadow-sm"
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>
    </div>
  );
}
