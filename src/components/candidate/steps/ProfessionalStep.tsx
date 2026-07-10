import { UseFormReturn } from "react-hook-form";
import { CandidateProfileInput } from "@/lib/validations/candidate";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function ProfessionalStep({ form }: { form: UseFormReturn<CandidateProfileInput> }) {
  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold font-heading">Professional Details</h2>
        <p className="text-muted-foreground font-medium">Tell us about your work experience and expectations.</p>
      </div>

      <FormField
        control={form.control}
        name="experience_level"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="font-bold">Experience Level *</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger className="h-12 border-2 rounded-xl focus:ring-primary shadow-sm bg-white">
                  <SelectValue placeholder="Select level" />
                </SelectTrigger>
              </FormControl>
              <SelectContent className="rounded-xl border border-border shadow-md font-medium">
                <SelectItem value="Entry Level">Entry Level</SelectItem>
                <SelectItem value="Mid Level">Mid Level</SelectItem>
                <SelectItem value="Senior Level">Senior Level</SelectItem>
                <SelectItem value="Director">Director</SelectItem>
                <SelectItem value="Executive">Executive</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={form.control}
          name="current_company"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-bold">Current Company</FormLabel>
              <FormControl>
                <Input 
                  placeholder="e.g. Acme Corp" 
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
          name="current_position"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-bold">Current Position</FormLabel>
              <FormControl>
                <Input 
                  placeholder="e.g. Software Engineer" 
                  className="h-12 border-2 rounded-xl focus-visible:ring-primary shadow-sm"
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={form.control}
          name="current_salary"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-bold">Current Salary</FormLabel>
              <FormControl>
                <Input 
                  placeholder="e.g. $80,000" 
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
          name="expected_salary"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-bold">Expected Salary</FormLabel>
              <FormControl>
                <Input 
                  placeholder="e.g. $100,000+" 
                  className="h-12 border-2 rounded-xl focus-visible:ring-primary shadow-sm"
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={form.control}
        name="notice_period"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="font-bold">Notice Period</FormLabel>
            <FormControl>
              <Input 
                placeholder="e.g. 30 days, Immediate" 
                className="h-12 border-2 rounded-xl focus-visible:ring-primary shadow-sm"
                {...field} 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
