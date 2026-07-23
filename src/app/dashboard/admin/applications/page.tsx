"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { DataTable, DataTableColumnHeader } from "@/components/ui/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { Eye, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getAdminApplicationsAction } from "@/actions/admin/users";

export type ApplicationAdmin = {
  id: string;
  candidate_name: string;
  job_title: string;
  status: string;
  applied_at: string;
};

export const columns: ColumnDef<ApplicationAdmin>[] = [
  {
    accessorKey: "candidate_name",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Candidate" />,
    cell: ({ row }) => (
      <div className="font-bold">{row.getValue("candidate_name") || "Unknown"}</div>
    ),
  },
  {
    accessorKey: "job_title",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Job Title" />,
    cell: ({ row }) => (
      <div className="font-medium text-muted-foreground">{row.getValue("job_title") || "Unknown"}</div>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      const colorClass = 
        status === "Applied" ? "bg-blue-50 text-blue-700 border-blue-200" :
        status === "Under Review" ? "bg-amber-50 text-amber-700 border-amber-200" :
        status === "Interviewing" ? "bg-purple-50 text-purple-700 border-purple-200" :
        status === "Offer" ? "bg-emerald-50 text-emerald-700 border-emerald-200" :
        status === "Hired" ? "bg-green-50 text-green-700 border-green-200" :
        "bg-red-50 text-red-700 border-red-200";

      return (
        <span className={`px-2.5 py-1 rounded-full text-xs font-bold border-2 ${colorClass}`}>
          {status}
        </span>
      );
    },
  },
  {
    accessorKey: "applied_at",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Applied Date" />,
    cell: ({ row }) => {
      return new Date(row.getValue("applied_at")).toLocaleDateString();
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      return (
        <div className="flex items-center justify-end gap-2">
          <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50">
            <Eye size={16} />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-amber-600 hover:text-amber-700 hover:bg-amber-50">
            <Edit size={16} />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50">
            <Trash2 size={16} />
          </Button>
        </div>
      );
    },
  },
];

export default function AdminApplicationsPage() {
  const [data, setData] = useState<ApplicationAdmin[]>([]);
  const [loading, setLoading] = useState(true);

  async function fetchData() {
    try {
      const result = await getAdminApplicationsAction();

      if (!result.success) {
        console.error("Error fetching applications:", result.error);
        return;
      }

      if (result.data) {
        const formatted = result.data.map((a: any) => ({
          id: a.id,
          status: a.status,
          applied_at: a.applied_at,
          job_title: a.jobs?.title || "Unknown Job",
          candidate_name: a.users?.full_name || "Unknown Candidate",
        }));
        setData(formatted);
      }
    } catch (err) {
      console.error("Unexpected error in fetchData:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="font-heading text-3xl font-extrabold tracking-tight">Applications</h1>
          <p className="text-muted-foreground font-medium mt-1">Monitor all job applications across the platform.</p>
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
        <DataTable columns={columns} data={data} searchKey="candidate_name" />
      )}
    </div>
  );
}