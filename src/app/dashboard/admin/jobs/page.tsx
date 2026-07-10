"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { DataTable, DataTableColumnHeader } from "@/components/ui/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { Trash2, CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { approveJobAction, rejectJobAction, deleteJobAction } from "@/actions/admin/jobs";
import { toast } from "sonner";

export type JobAdmin = {
  id: string;
  title: string;
  company_name: string;
  status: string;
  applicants: number;
  created_at: string;
};

export const columns: ColumnDef<JobAdmin>[] = [
  {
    accessorKey: "title",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Job Title" />,
    cell: ({ row }) => <div className="font-bold">{row.getValue("title")}</div>,
  },
  {
    accessorKey: "company_name",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Company" />,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      return (
        <span className={`px-2.5 py-1 rounded-full text-xs font-bold border-2 \${
          status === "Active" ? "bg-green-50 text-green-700 border-green-200" :
          status === "Draft" ? "bg-amber-50 text-amber-700 border-amber-200" :
          status === "Rejected" ? "bg-red-50 text-red-700 border-red-200" :
          "bg-muted text-muted-foreground border-border"
        }`}>
          {status}
        </span>
      );
    },
  },
  {
    accessorKey: "applicants",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Applicants" />,
    cell: ({ row }) => {
      const applicants = row.getValue("applicants") as number;
      return <div className="font-bold">{applicants}</div>;
    },
  },
  {
    accessorKey: "created_at",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Posted Date" />,
    cell: ({ row }) => {
      return new Date(row.getValue("created_at")).toLocaleDateString();
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const job = row.original;
      return (
        <div className="flex items-center justify-end gap-2">
          {job.status !== "Active" && (
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 text-green-600 hover:text-green-700 hover:bg-green-50"
              onClick={async () => {
                const res = await approveJobAction(job.id);
                if (res.success) toast.success("Job Approved");
                else toast.error(res.error);
              }}
            >
              <CheckCircle size={16} />
            </Button>
          )}
          {job.status !== "Rejected" && (
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 text-amber-600 hover:text-amber-700 hover:bg-amber-50"
              onClick={async () => {
                const res = await rejectJobAction(job.id);
                if (res.success) toast.success("Job Rejected");
                else toast.error(res.error);
              }}
            >
              <XCircle size={16} />
            </Button>
          )}
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
            onClick={async () => {
              if (confirm("Are you sure you want to delete this job?")) {
                const res = await deleteJobAction(job.id);
                if (res.success) toast.success("Job Deleted");
                else toast.error(res.error);
              }
            }}
          >
            <Trash2 size={16} />
          </Button>
        </div>
      );
    },
  },
];

export default function AdminJobsPage() {
  const [data, setData] = useState<JobAdmin[]>([]);
  const [loading, setLoading] = useState(true);

  async function fetchData() {
    const supabase = createClient();
    const { data: jobs, error } = await supabase
      .from("jobs")
      .select(`
        id, title, status, created_at,
        companies (name),
        applications (id)
      `)
      .order("created_at", { ascending: false });

    if (jobs) {
      const formatted = jobs.map((j: any) => ({
        id: j.id,
        title: j.title,
        company_name: j.companies && !Array.isArray(j.companies) ? j.companies.name : "Unknown",
        status: j.status,
        applicants: j.applications ? j.applications.length : 0,
        created_at: j.created_at,
      }));
      setData(formatted);
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="font-heading text-3xl font-extrabold tracking-tight">Manage Jobs</h1>
          <p className="text-muted-foreground font-medium mt-1">View, approve, and manage all job listings on the platform.</p>
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
        <DataTable columns={columns} data={data} searchKey="title" />
      )}
    </div>
  );
}
