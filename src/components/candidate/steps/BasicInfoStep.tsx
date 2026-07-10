import { UseFormReturn } from "react-hook-form";
import { CandidateProfileInput } from "@/lib/validations/candidate";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { SUGGESTED_HEADLINES, SUGGESTED_CITIES } from "@/lib/constants/suggestions";

export function BasicInfoStep({ form }: { form: UseFormReturn<CandidateProfileInput> }) {
  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold font-heading">Basic Information</h2>
        <p className="text-muted-foreground font-medium">Let's start with the basics so employers know who you are.</p>
      </div>

      <FormField
        control={form.control}
        name="headline"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="font-bold">Professional Headline *</FormLabel>
            <FormControl>
              <>
                <Input 
                  placeholder="e.g. Senior Frontend Engineer | React Specialist" 
                  className="h-12 border-2 rounded-xl focus-visible:ring-primary focus-visible:border-primary shadow-sm"
                  list="headline-suggestions"
                  {...field} 
                />
                <datalist id="headline-suggestions">
                  {SUGGESTED_HEADLINES.map(headline => (
                    <option key={headline} value={headline} />
                  ))}
                </datalist>
              </>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="bio"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="font-bold">Bio</FormLabel>
            <FormControl>
              <Textarea 
                placeholder="Tell us a little bit about yourself..." 
                className="resize-none border-2 rounded-xl focus-visible:ring-primary focus-visible:border-primary shadow-sm min-h-[120px]"
                {...field} 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-bold">Phone Number</FormLabel>
              <FormControl>
                <Input 
                  placeholder="+1 (555) 000-0000" 
                  className="h-12 border-2 rounded-xl shadow-sm focus-visible:ring-primary"
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="date_of_birth"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-bold">Date of Birth</FormLabel>
              <FormControl>
                <Input 
                  type="date"
                  className="h-12 border-2 rounded-xl shadow-sm focus-visible:ring-primary"
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
          name="city"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-bold">City *</FormLabel>
              <FormControl>
                <>
                  <Input 
                    placeholder="San Francisco" 
                    className="h-12 border-2 rounded-xl shadow-sm focus-visible:ring-primary"
                    list="city-suggestions"
                    {...field} 
                  />
                  <datalist id="city-suggestions">
                    {SUGGESTED_CITIES.map(city => (
                      <option key={city} value={city} />
                    ))}
                  </datalist>
                </>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="country"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-bold">Country *</FormLabel>
              <FormControl>
                <Input 
                  placeholder="United States" 
                  className="h-12 border-2 rounded-xl shadow-sm focus-visible:ring-primary"
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}
