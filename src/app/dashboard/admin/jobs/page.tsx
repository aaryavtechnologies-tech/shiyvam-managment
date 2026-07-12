"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { DataTable, DataTableColumnHeader } from "@/components/ui/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { Trash2, CheckCircle, XCircle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { approveJobAction, rejectJobAction, deleteJobAction } from "@/actions/admin/jobs";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export type JobAdmin = {
  id: string;
  title: string;
  company_name: string;
  admin_status: string;
  status: string;
  applicants: number;
  created_at: string;
};

export default function AdminJobsPage() {
  const [data, setData] = useState<JobAdmin[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("pending");

  async function fetchData() {
    setLoading(true);
    const supabase = createClient();
    const { data: jobs, error } = await supabase
      .from("jobs")
      .select(`
        id, title, status, admin_status, created_at,
        companies (name),
        applications (id)
      `)
      .order("created_at", { ascending: false });

    if (jobs) {
      const formatted = jobs.map((j: any) => ({
        id: j.id,
        title: j.title,
        company_name: j.companies && !Array.isArray(j.companies) ? j.companies.name : "Unknown",
        admin_status: j.admin_status || 'pending',
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

  const getColumns = (): ColumnDef<JobAdmin>[] => [
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
      accessorKey: "admin_status",
      header: "Status",
      cell: ({ row }) => {
        const status = (row.getValue("admin_status") as string).toLowerCase();
        return (
          <span className={`px-2.5 py-1 rounded-full text-xs font-bold border-2 capitalize \${
            status === "approved" ? "bg-green-50 text-green-700 border-green-200" :
            status === "pending" ? "bg-amber-50 text-amber-700 border-amber-200" :
            status === "rejected" ? "bg-red-50 text-red-700 border-red-200" :
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
        const status = job.admin_status.toLowerCase();
        return (
          <div className="flex items-center justify-end gap-2">
            {status === "pending" && (
              <>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="text-green-600 border-green-200 bg-green-50 hover:bg-green-100 font-bold"
                  onClick={async () => {
                    const res = await approveJobAction(job.id);
                    if (res.success) { toast.success("Job Approved"); fetchData(); }
                    else toast.error(res.error || "Failed to approve job");
                  }}
                >
                  <CheckCircle size={16} className="mr-1" /> Approve
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="text-red-600 border-red-200 bg-red-50 hover:bg-red-100 font-bold"
                  onClick={async () => {
                    const reason = prompt("Enter rejection reason:");
                    if (reason !== null) {
                      const res = await rejectJobAction(job.id, reason);
                      if (res.success) { toast.success("Job Rejected"); fetchData(); }
                      else toast.error(res.error || "Failed to reject job");
                    }
                  }}
                >
                  <XCircle size={16} className="mr-1" /> Reject
                </Button>
              </>
            )}
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
              onClick={async () => {
                if (confirm("Are you sure you want to completely delete this job?")) {
                  const res = await deleteJobAction(job.id);
                  if (res.success) { toast.success("Job Deleted"); fetchData(); }
                  else toast.error(res.error || "Failed to delete job");
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

  const filteredData = data.filter(j => j.admin_status.toLowerCase() === activeTab);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="font-heading text-3xl font-extrabold tracking-tight">Manage Jobs</h1>
          <p className="text-muted-foreground font-medium mt-1">Review pending jobs before they go live on the platform.</p>
        </div>
        <Button className="border border-border shadow-sm font-bold bg-primary text-primary-foreground hover:bg-primary/90">
          Export CSV
        </Button>
      </div>

      <Tabs defaultValue="pending" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4 max-w-2xl bg-white border-2 border-border shadow-sm rounded-xl h-12 p-1">
          <TabsTrigger value="pending" className="rounded-lg font-bold">Pending</TabsTrigger>
          <TabsTrigger value="approved" className="rounded-lg font-bold">Approved</TabsTrigger>
          <TabsTrigger value="rejected" className="rounded-lg font-bold">Rejected</TabsTrigger>
          <TabsTrigger value="expired" className="rounded-lg font-bold">Expired</TabsTrigger>
        </TabsList>

        <div className="mt-6">
          {loading ? (
            <div className="h-64 flex items-center justify-center bg-white border-2 border-border rounded-[2rem] shadow-sm">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <DataTable columns={getColumns()} data={filteredData} searchKey="title" />
          )}
        </div>
      </Tabs>
    </div>
  );
}
