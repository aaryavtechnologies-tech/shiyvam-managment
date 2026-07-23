"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { adminCreateJobAction } from "@/actions/admin/jobs";
import { toast } from "sonner";
import { ArrowLeft, Loader2, Save, Building, Briefcase } from "lucide-react";
import Link from "next/link";
import { Card } from "@/components/ui/card";

export default function AdminCreateJobPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const result = await adminCreateJobAction(formData);

    if (result.success) {
      toast.success("Job posted successfully");
      router.push("/dashboard/admin/jobs");
    } else {
      toast.error(result.error || "Failed to post job");
    }
    setLoading(false);
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/dashboard/admin/jobs">
          <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl hover:bg-white hover:shadow-sm border-2 border-transparent hover:border-border transition-all">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="font-heading text-2xl font-black tracking-tight">Create New Job (Admin)</h1>
          <p className="text-muted-foreground font-medium text-sm mt-1">
            Publish a job directly from the admin console.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* Company Details */}
        <Card className="p-6 border-2 border-border shadow-md rounded-2xl bg-white">
          <h2 className="text-lg font-black font-heading mb-4 flex items-center gap-2">
            <Building className="text-primary" /> Company Details
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Company Name <span className="text-red-500">*</span></label>
              <Input name="companyName" required placeholder="e.g. Acme Corp" className="bg-gray-50 h-11 border-gray-200" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Industry</label>
              <Input name="industry" placeholder="e.g. Technology" className="bg-gray-50 h-11 border-gray-200" />
            </div>
          </div>
        </Card>

        {/* Job Details */}
        <Card className="p-6 border-2 border-border shadow-md rounded-2xl bg-white space-y-6">
          <h2 className="text-lg font-black font-heading mb-4 flex items-center gap-2">
            <Briefcase className="text-primary" /> Job Details
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-semibold text-gray-700">Job Title <span className="text-red-500">*</span></label>
              <Input name="title" required placeholder="e.g. Senior Frontend Developer" className="bg-gray-50 h-11 border-gray-200 text-lg font-bold" />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-semibold text-gray-700">Description <span className="text-red-500">*</span></label>
              <Textarea name="description" required placeholder="Describe the job role..." className="bg-gray-50 border-gray-200 min-h-[120px]" />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-semibold text-gray-700">Requirements</label>
              <Textarea name="requirements" placeholder="List the requirements..." className="bg-gray-50 border-gray-200 min-h-[100px]" />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Department</label>
              <Input name="department" placeholder="e.g. Engineering" className="bg-gray-50 h-11 border-gray-200" />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Location <span className="text-red-500">*</span></label>
              <Input name="location" required placeholder="e.g. Remote, USA" className="bg-gray-50 h-11 border-gray-200" />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Employment Type <span className="text-red-500">*</span></label>
              <Select name="employmentType" defaultValue="Full-time" required>
                <SelectTrigger className="bg-gray-50 h-11 border-gray-200 font-medium">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Full-time">Full-time</SelectItem>
                  <SelectItem value="Part-time">Part-time</SelectItem>
                  <SelectItem value="Contract">Contract</SelectItem>
                  <SelectItem value="Internship">Internship</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Salary Range (Optional)</label>
              <div className="flex items-center gap-2">
                <Input type="number" name="minSalary" placeholder="Min" className="bg-gray-50 h-11 border-gray-200" />
                <span className="text-gray-400 font-medium">to</span>
                <Input type="number" name="maxSalary" placeholder="Max" className="bg-gray-50 h-11 border-gray-200" />
              </div>
            </div>
          </div>
        </Card>

        <div className="flex justify-end pt-4">
          <Button type="submit" disabled={loading} className="bg-primary text-white h-12 px-8 rounded-xl font-bold shadow-md hover:bg-primary/90 text-lg">
            {loading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Save className="mr-2 h-5 w-5" />}
            Publish Job
          </Button>
        </div>
      </form>
    </div>
  );
}
