"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { DataTable, DataTableColumnHeader } from "@/components/ui/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { Trash2, FileText, Download, UserPlus, CheckCircle, XCircle, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { deleteUserAction, getAdminCandidatesAction, getAdminRecruitersAction } from "@/actions/admin/users";
import { updateCandidateStatusAction, assignRecruiterAction } from "@/actions/admin/candidates";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

export type CandidateAdmin = {
  id: string;
  email: string;
  full_name: string;
  applications: number;
  created_at: string;
  status: string;
  resume_url: string | null;
  assigned_recruiter_id: string | null;
  assigned_recruiter_name: string | null;
};

export default function AdminCandidatesPage() {
  const [data, setData] = useState<CandidateAdmin[]>([]);
  const [employers, setEmployers] = useState<{id: string, name: string}[]>([]);
  const [loading, setLoading] = useState(true);

  async function fetchData() {
    setLoading(true);
    
    // Fetch candidates
    const candidatesRes = await getAdminCandidatesAction();
    const recruitersRes = await getAdminRecruitersAction();
      
    if (recruitersRes.success && recruitersRes.data) {
      const employersList = recruitersRes.data.map((e: any) => ({
        id: e.id,
        name: e.full_name || e.email
      }));
      setEmployers(employersList);
    }

    if (candidatesRes.success && candidatesRes.data) {
      const formatted = candidatesRes.data.map((u: any) => {
        const profile = Array.isArray(u.candidate_profiles) && u.candidate_profiles.length > 0 
          ? u.candidate_profiles[0] 
          : (u.candidate_profiles || {});
          
        let recruiterName = null;
        if (profile.assigned_recruiter_id && recruitersRes.data) {
          const rec = recruitersRes.data.find((e: any) => e.id === profile.assigned_recruiter_id);
          if (rec) recruiterName = rec.full_name || rec.email;
        }

        return {
          id: u.id,
          email: u.email,
          full_name: u.full_name,
          applications: Array.isArray(u.applications) ? u.applications.length : 0,
          created_at: u.created_at,
          status: profile.candidate_status || "pending",
          resume_url: profile.resume_url || null,
          assigned_recruiter_id: profile.assigned_recruiter_id || null,
          assigned_recruiter_name: recruiterName
        };
      });
      setData(formatted);
    } else {
      toast.error(candidatesRes.error || "Failed to fetch candidates");
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchData();
  }, []);

  const handleStatusChange = async (userId: string, status: string) => {
    const res = await updateCandidateStatusAction(userId, status);
    if (res.success) {
      toast.success(`Candidate marked as ${status}`);
      fetchData();
    } else toast.error(res.error || "Failed to update status");
  };

  const handleAssignRecruiter = async (userId: string, recruiterId: string | null) => {
    const res = await assignRecruiterAction(userId, recruiterId === 'unassign' ? null : recruiterId);
    if (res.success) {
      toast.success("Recruiter assigned successfully");
      fetchData();
    } else toast.error(res.error || "Failed to assign recruiter");
  };

  const handleDownloadResume = async (url: string, name: string) => {
    const downloadUrl = url.startsWith('/') || url.startsWith('http') 
      ? url 
      : `/uploads/candidate-resumes/${url}`;
      
    const a = document.createElement('a');
    a.href = downloadUrl;
    a.target = '_blank';
    a.download = `${name.replace(/\s+/g, '_')}_Resume.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const columns: ColumnDef<CandidateAdmin>[] = [
    {
      accessorKey: "full_name",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Candidate" />,
      cell: ({ row }) => (
        <div className="flex items-center gap-3 min-w-[160px]">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 text-primary flex items-center justify-center font-black text-sm border border-primary/20 shadow-sm flex-shrink-0">
            {(row.getValue("full_name") as string)?.charAt(0).toUpperCase() || "?"}
          </div>
          <div>
            <p className="font-bold text-gray-900 leading-tight">{row.getValue("full_name") || "No Name"}</p>
            <p className="text-xs text-muted-foreground font-medium">{row.original.email}</p>
          </div>
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const s = row.getValue("status") as string;
        return (
          <Badge className={`capitalize font-bold px-3 py-1 rounded-lg text-xs ${
            s === 'shortlisted' ? 'bg-green-100 text-green-700 border border-green-200' :
            s === 'rejected' ? 'bg-red-100 text-red-700 border border-red-200' :
            'bg-amber-100 text-amber-700 border border-amber-200'
          }`}>
            {s}
          </Badge>
        );
      }
    },
    {
      accessorKey: "applications",
      header: "Applications",
      cell: ({ row }) => (
        <div className="text-center">
          <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-primary/10 text-primary font-black text-xs">
            {row.getValue("applications")}
          </span>
        </div>
      ),
    },
    {
      accessorKey: "assigned_recruiter_name",
      header: "Recruiter",
      cell: ({ row }) => (
        <Select
          value={row.original.assigned_recruiter_id || "unassign"}
          onValueChange={(val) => handleAssignRecruiter(row.original.id as string, val)}
        >
          <SelectTrigger className="w-[150px] h-8 text-xs font-bold border-2 rounded-lg">
            <SelectValue placeholder="Assign..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="unassign" className="text-muted-foreground font-bold">Unassigned</SelectItem>
            {employers.map(e => (
              <SelectItem key={e.id} value={e.id} className="font-bold">{e.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      )
    },
    {
      id: "resume",
      header: "Resume",
      cell: ({ row }) => {
        if (!row.original.resume_url) return <span className="text-xs text-muted-foreground italic">None</span>;
        return (
          <Button variant="outline" size="sm" className="h-8 text-xs font-bold border-2 rounded-lg gap-1.5" onClick={() => handleDownloadResume(row.original.resume_url!, row.original.full_name)}>
            <Download size={12} /> PDF
          </Button>
        );
      }
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        return (
          <div className="flex items-center gap-2">
            <Link href={`/dashboard/admin/candidates/${row.original.id}`}>
              <Button size="sm" className="h-8 px-3 text-xs font-bold bg-primary text-white rounded-lg shadow-sm hover:bg-primary/90 gap-1.5">
                <Eye size={13} /> View
              </Button>
            </Link>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-green-600 hover:text-green-700 hover:bg-green-50 rounded-lg" onClick={() => handleStatusChange(row.original.id, 'shortlisted')} title="Shortlist">
              <CheckCircle size={15} />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50 rounded-lg" onClick={() => handleStatusChange(row.original.id, 'rejected')} title="Reject">
              <XCircle size={15} />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:bg-red-50 hover:text-red-500 rounded-lg" onClick={async () => {
              if (confirm("Are you sure you want to delete this candidate?")) {
                const res = await deleteUserAction(row.original.id);
                if (res.success) toast.success("Candidate deleted");
                else toast.error(res.error || "Failed to delete candidate");
              }
            }}>
              <Trash2 size={15} />
            </Button>
          </div>
        );
      },
    },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="font-heading text-3xl font-extrabold tracking-tight">Candidates</h1>
          <p className="text-muted-foreground font-medium mt-1">Manage job seekers, track status, and assign recruiters.</p>
        </div>
        <Button className="border border-border shadow-sm font-bold bg-primary text-primary-foreground hover:bg-primary/90">
          Export CSV
        </Button>
      </div>

      {loading ? (
        <div className="h-64 flex items-center justify-center bg-white border-2 border-border rounded-[2rem] shadow-sm">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : (
        <DataTable columns={columns} data={data} searchKey="full_name" />
      )}
    </div>
  );
}