"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { DataTable, DataTableColumnHeader } from "@/components/ui/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { Trash2, FileText, Download, UserPlus, CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { deleteUserAction } from "@/actions/admin/users";
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
    const supabase = createClient();
    
    // Fetch candidates
    const { data: users, error } = await supabase
      .from("users")
      .select(`
        id, email, full_name, created_at,
        applications (id),
        candidate_profiles (resume_url, candidate_status, assigned_recruiter_id)
      `)
      .eq("role", "candidate")
      .order("created_at", { ascending: false });

    // Fetch employers (recruiters)
    const { data: employerData } = await supabase
      .from("users")
      .select("id, full_name, email")
      .eq("role", "employer");
      
    const employersList = employerData?.map(e => ({
      id: e.id,
      name: e.full_name || e.email
    })) || [];
    setEmployers(employersList);

    if (users) {
      const formatted = users.map((u: any) => {
        const profile = u.candidate_profiles && u.candidate_profiles.length > 0 ? u.candidate_profiles[0] : null;
        let recName = null;
        if (profile?.assigned_recruiter_id) {
          const emp = employersList.find(e => e.id === profile.assigned_recruiter_id);
          if (emp) recName = emp.name;
        }

        return {
          id: u.id,
          email: u.email,
          full_name: u.full_name,
          applications: u.applications ? u.applications.length : 0,
          created_at: u.created_at,
          status: profile?.candidate_status || 'pending',
          resume_url: profile?.resume_url || null,
          assigned_recruiter_id: profile?.assigned_recruiter_id || null,
          assigned_recruiter_name: recName
        };
      });
      setData(formatted);
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

  const handleAssignRecruiter = async (userId: string, recruiterId: string) => {
    const res = await assignRecruiterAction(userId, recruiterId === 'unassign' ? null : recruiterId);
    if (res.success) {
      toast.success("Recruiter assigned successfully");
      fetchData();
    } else toast.error(res.error || "Failed to assign recruiter");
  };

  const handleDownloadResume = async (url: string, name: string) => {
    const supabase = createClient();
    const { data, error } = await supabase.storage.from('candidate-resumes').download(url);
    if (error || !data) {
      toast.error("Resume not found or access denied.");
      return;
    }
    const blobUrl = URL.createObjectURL(data);
    const a = document.createElement('a');
    a.href = blobUrl;
    a.download = `${name.replace(/\s+/g, '_')}_Resume.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const columns: ColumnDef<CandidateAdmin>[] = [
    {
      accessorKey: "full_name",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Name" />,
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">
            {(row.getValue("full_name") as string)?.charAt(0).toUpperCase() || (row.getValue("email") as string)?.charAt(0).toUpperCase()}
          </div>
          <span className="font-bold">{row.getValue("full_name") || "No Name"}</span>
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const s = row.getValue("status") as string;
        return (
          <Badge variant="outline" className={`capitalize \${
            s === 'shortlisted' ? 'border-green-300 text-green-700 bg-green-50' :
            s === 'rejected' ? 'border-red-300 text-red-700 bg-red-50' : 
            'border-amber-300 text-amber-700 bg-amber-50'
          }`}>
            {s}
          </Badge>
        );
      }
    },
    {
      accessorKey: "assigned_recruiter_name",
      header: "Assigned Recruiter",
      cell: ({ row }) => {
        const recruiter = row.original.assigned_recruiter_name;
        return (
          <Select 
            value={row.original.assigned_recruiter_id || "unassign"} 
            onValueChange={(val) => handleAssignRecruiter(row.original.id, val)}
          >
            <SelectTrigger className="w-[140px] h-8 text-xs font-bold border-2">
              <SelectValue placeholder="Assign..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="unassign" className="text-muted-foreground font-bold">Unassigned</SelectItem>
              {employers.map(e => (
                <SelectItem key={e.id} value={e.id} className="font-bold">{e.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      }
    },
    {
      id: "resume",
      header: "Resume",
      cell: ({ row }) => {
        if (!row.original.resume_url) return <span className="text-xs text-muted-foreground">None</span>;
        return (
          <Button variant="outline" size="sm" onClick={() => handleDownloadResume(row.original.resume_url!, row.original.full_name)}>
            <Download size={14} className="mr-1"/> Download
          </Button>
        );
      }
    },
    {
      id: "actions",
      cell: ({ row }) => {
        return (
          <div className="flex items-center justify-end gap-1">
            <Button variant="ghost" size="icon" className="h-8 w-8 text-green-600 hover:text-green-700 hover:bg-green-50" onClick={() => handleStatusChange(row.original.id, 'shortlisted')} title="Shortlist">
              <CheckCircle size={16} />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50" onClick={() => handleStatusChange(row.original.id, 'rejected')} title="Reject">
              <XCircle size={16} />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:bg-muted" onClick={async () => {
              if (confirm("Are you sure you want to delete this candidate?")) {
                const res = await deleteUserAction(row.original.id);
                if (res.success) toast.success("Candidate deleted");
                else toast.error(res.error || "Failed to delete candidate");
              }
            }}>
              <Trash2 size={16} />
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