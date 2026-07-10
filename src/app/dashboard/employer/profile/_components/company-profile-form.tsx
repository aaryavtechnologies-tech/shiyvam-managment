"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Save, Loader2, ImageIcon, Check } from "lucide-react";
import { updateCompanyProfile } from "@/actions/employer/profile";

const profileSchema = z.object({
  name: z.string().min(2, "Company name is required"),
  industry: z.string().min(2, "Industry is required"),
  website: z.string().url("Must be a valid URL").or(z.literal("")),
  location: z.string().min(2, "Location is required"),
  company_size: z.string().min(1, "Company size is required"),
  description: z.string().min(10, "Please provide a brief description"),
  mission: z.string(),
  remote_policy: z.string(),
  logo_url: z.string(),
  cover_image_url: z.string(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export function CompanyProfileForm({ initialData }: { initialData: ProfileFormValues }) {
  const [isSaving, setIsSaving] = useState(false);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: initialData,
  });

  const onSubmit = async (data: ProfileFormValues) => {
    setIsSaving(true);
    try {
      const res = await updateCompanyProfile(data);
      if (res.success) {
        toast.success("Company profile updated successfully!");
      } else {
        toast.error(res.error || "Failed to update profile");
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setIsSaving(false);
    }
  };

  const formValues = form.watch();

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 pb-12">
      <Card className="p-8 border-2 border-border shadow-md rounded-2xl space-y-6">
        <div>
          <h2 className="text-xl font-black font-heading mb-4">Basic Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="font-bold">Company Name</Label>
              <Input {...form.register("name")} className="h-12 border-2 border-border rounded-xl focus-visible:ring-secondary/20 font-medium" />
              {form.formState.errors.name && <p className="text-sm text-destructive font-bold">{form.formState.errors.name.message}</p>}
            </div>
            <div className="space-y-2">
              <Label className="font-bold">Industry</Label>
              <Input {...form.register("industry")} className="h-12 border-2 border-border rounded-xl focus-visible:ring-secondary/20 font-medium" />
              {form.formState.errors.industry && <p className="text-sm text-destructive font-bold">{form.formState.errors.industry.message}</p>}
            </div>
            <div className="space-y-2">
              <Label className="font-bold">Website</Label>
              <Input {...form.register("website")} placeholder="https://" className="h-12 border-2 border-border rounded-xl focus-visible:ring-secondary/20 font-medium" />
              {form.formState.errors.website && <p className="text-sm text-destructive font-bold">{form.formState.errors.website.message}</p>}
            </div>
            <div className="space-y-2">
              <Label className="font-bold">Headquarters Location</Label>
              <Input {...form.register("location")} className="h-12 border-2 border-border rounded-xl focus-visible:ring-secondary/20 font-medium" />
            </div>
            <div className="space-y-2">
              <Label className="font-bold">Company Size</Label>
              <select 
                {...form.register("company_size")}
                className="flex h-12 w-full items-center justify-between rounded-xl border-2 border-border bg-transparent px-3 py-2 text-sm font-medium ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-secondary/20 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="">Select size</option>
                <option value="1-10">1-10 employees</option>
                <option value="11-50">11-50 employees</option>
                <option value="51-200">51-200 employees</option>
                <option value="201-500">201-500 employees</option>
                <option value="500+">500+ employees</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label className="font-bold">Remote Policy</Label>
              <select 
                {...form.register("remote_policy")}
                className="flex h-12 w-full items-center justify-between rounded-xl border-2 border-border bg-transparent px-3 py-2 text-sm font-medium ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-secondary/20 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="">Select policy</option>
                <option value="On-site">On-site Only</option>
                <option value="Hybrid">Hybrid</option>
                <option value="Remote">Fully Remote</option>
              </select>
            </div>
          </div>
        </div>
      </Card>

      <Card className="p-8 border-2 border-border shadow-md rounded-2xl space-y-6">
        <div>
          <h2 className="text-xl font-black font-heading mb-4">About the Company</h2>
          <div className="space-y-6">
            <div className="space-y-2">
              <Label className="font-bold">Company Description</Label>
              <Textarea {...form.register("description")} className="min-h-[120px] border-2 border-border rounded-xl focus-visible:ring-secondary/20 font-medium" />
              {form.formState.errors.description && <p className="text-sm text-destructive font-bold">{form.formState.errors.description.message}</p>}
            </div>
            <div className="space-y-2">
              <Label className="font-bold">Company Mission (Optional)</Label>
              <Textarea {...form.register("mission")} className="min-h-[100px] border-2 border-border rounded-xl focus-visible:ring-secondary/20 font-medium" />
            </div>
          </div>
        </div>
      </Card>

      <Card className="p-8 border-2 border-border shadow-md rounded-2xl space-y-6">
        <div>
          <h2 className="text-xl font-black font-heading mb-4">Brand Assets</h2>
          <p className="text-muted-foreground text-sm font-medium mb-6">If you need to update your logo or cover image, please re-upload them here.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Logo Display (Upload functionality would go here, reusing the onboarding logic ideally, simplified for now) */}
            <div className="space-y-4">
              <Label className="font-bold">Current Logo</Label>
              <div className="border-2 border-dashed border-border rounded-2xl p-6 text-center bg-muted/20">
                {formValues.logo_url ? (
                  <div className="w-24 h-24 mx-auto relative rounded-xl overflow-hidden border-2 border-border shadow-sm">
                    <img src={formValues.logo_url} alt="Logo" className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <div className="w-12 h-12 bg-white border-2 border-border rounded-full flex items-center justify-center mx-auto mb-4">
                    <ImageIcon size={24} className="text-secondary" />
                  </div>
                )}
                <p className="text-xs text-muted-foreground mt-4 font-medium">To change your logo, use the asset manager.</p>
              </div>
            </div>

            <div className="space-y-4">
              <Label className="font-bold">Current Cover Image</Label>
              <div className="border-2 border-dashed border-border rounded-2xl p-6 text-center bg-muted/20">
                {formValues.cover_image_url ? (
                  <div className="w-full h-24 mx-auto relative rounded-xl overflow-hidden border-2 border-border shadow-sm">
                    <img src={formValues.cover_image_url} alt="Cover" className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <div className="w-12 h-12 bg-white border-2 border-border rounded-full flex items-center justify-center mx-auto mb-4">
                    <ImageIcon size={24} className="text-primary" />
                  </div>
                )}
                <p className="text-xs text-muted-foreground mt-4 font-medium">To change your cover, use the asset manager.</p>
              </div>
            </div>
          </div>
        </div>
      </Card>

      <div className="flex justify-end pt-4 sticky bottom-8">
        <Button 
          type="submit" 
          disabled={isSaving}
          className="h-12 px-8 rounded-xl border border-border bg-primary text-primary-foreground shadow-md hover:bg-primary/90 hover:-translate-y-0.5 hover:shadow-lg transition-all font-bold gap-2 text-lg"
        >
          {isSaving ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Save className="w-5 h-5" />
          )}
          {isSaving ? "Saving..." : "Save Profile"}
        </Button>
      </div>
    </form>
  );
}
