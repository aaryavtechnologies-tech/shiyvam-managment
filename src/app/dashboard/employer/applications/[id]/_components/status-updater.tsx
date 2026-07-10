"use client";

import { useState } from "react";
import { updateApplicationStatusAction } from "@/actions/employer/applications";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from "lucide-react";

export function ApplicationStatusUpdater({ appId, currentStatus }: { appId: string, currentStatus: string }) {
  const [status, setStatus] = useState(currentStatus);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleStatusChange = async (newStatus: string | null) => {
    if (!newStatus) return;
    setStatus(newStatus);
    setIsUpdating(true);
    try {
      const res = await updateApplicationStatusAction(appId, newStatus);
      if (res.success) {
        toast.success(`Status updated to ${newStatus}`);
      } else {
        toast.error(res.error || "Failed to update status");
        setStatus(currentStatus); // revert
      }
    } catch (error) {
      toast.error("An error occurred");
      setStatus(currentStatus); // revert
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm font-bold text-muted-foreground hidden sm:inline">Status:</span>
      <div className="relative">
        <Select value={status} onValueChange={handleStatusChange} disabled={isUpdating}>
          <SelectTrigger className={`w-[160px] h-10 border-2 border-border rounded-xl font-bold transition-all shadow-sm focus:ring-0 ${
            status === 'Shortlisted' || status === 'Interview' ? 'bg-purple-100 text-purple-800 border-purple-300 hover:bg-purple-200' :
            status === 'Offer' || status === 'Hired' ? 'bg-green-100 text-green-800 border-green-300 hover:bg-green-200' :
            status === 'Rejected' || status === 'Withdrawn' ? 'bg-red-100 text-red-800 border-red-300 hover:bg-red-200' :
            'bg-blue-100 text-blue-800 border-blue-300 hover:bg-blue-200'
          }`}>
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent className="border-2 border-border rounded-xl shadow-sm font-bold">
            <SelectItem value="Applied">Applied</SelectItem>
            <SelectItem value="Reviewing">Reviewing</SelectItem>
            <SelectItem value="Shortlisted">Shortlisted</SelectItem>
            <SelectItem value="Interview">Interview</SelectItem>
            <SelectItem value="Offer">Offer</SelectItem>
            <SelectItem value="Hired">Hired</SelectItem>
            <SelectItem value="Rejected" className="text-destructive">Rejected</SelectItem>
          </SelectContent>
        </Select>
        {isUpdating && (
          <div className="absolute right-[-30px] top-1/2 -translate-y-1/2">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          </div>
        )}
      </div>
    </div>
  );
}
