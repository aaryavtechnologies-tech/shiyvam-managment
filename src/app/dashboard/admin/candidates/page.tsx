"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { DataTable, DataTableColumnHeader } from "@/components/ui/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { Trash2, User, Eye, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { deleteUserAction } from "@/actions/admin/users";
import { toast } from "sonner";

export type CandidateAdmin = {
  id: string;
  email: string;
  full_name: string;
  applications: number;
  created_at: string;
};

export const columns: ColumnDef<CandidateAdmin>[] = [
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
    accessorKey: "email",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Email" />,
  },
  {
    accessorKey: "applications",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Applications" />,
    cell: ({ row }) => {
      const apps = row.getValue("applications") as number;
      return (
        <div className="flex items-center gap-1.5 font-bold">
          <FileText size={14} className="text-muted-foreground" />
          {apps}
        </div>
      );
    }
  },
  {
    accessorKey: "created_at",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Joined" />,
    cell: ({ row }) => {
      return new Date(row.getValue("created_at")).toLocaleDateString();
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
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
            onClick={async () => {
              if (confirm("Are you sure you want to delete this candidate?")) {
                const res = await deleteUserAction(row.original.id);
                if (res.success) toast.success("Candidate deleted");
                else toast.error(res.error || "Failed to delete candidate");
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

export default function AdminCandidatesPage() {
  const [data, setData] = useState<CandidateAdmin[]>([]);
  const [loading, setLoading] = useState(true);

  async function fetchData() {
    const supabase = createClient();
    const { data: users, error } = await supabase
      .from("users")
      .select(`
        id, email, full_name, created_at,
        applications (id)
      `)
      .eq("role", "candidate")
      .order("created_at", { ascending: false });

    if (users) {
      const formatted = users.map((u: any) => ({
        id: u.id,
        email: u.email,
        full_name: u.full_name,
        applications: u.applications ? u.applications.length : 0,
        created_at: u.created_at,
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
          <h1 className="font-heading text-3xl font-extrabold tracking-tight">Candidates</h1>
          <p className="text-muted-foreground font-medium mt-1">Manage job seekers and their applications.</p>
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