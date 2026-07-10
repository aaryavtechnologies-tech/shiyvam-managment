"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { DataTable, DataTableColumnHeader } from "@/components/ui/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { Trash2, Building, Eye, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { deleteUserAction } from "@/actions/admin/users";
import { toast } from "sonner";

export type EmployerAdmin = {
  id: string;
  email: string;
  full_name: string;
  companies: string;
  created_at: string;
};

export const columns: ColumnDef<EmployerAdmin>[] = [
  {
    accessorKey: "full_name",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Name" />,
    cell: ({ row }) => (
      <div className="font-bold">{row.getValue("full_name") || "No Name"}</div>
    ),
  },
  {
    accessorKey: "email",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Email" />,
  },
  {
    accessorKey: "companies",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Company" />,
    cell: ({ row }) => (
      <div className="flex items-center gap-1.5 font-medium">
        <Building size={14} className="text-muted-foreground" />
        {row.getValue("companies")}
      </div>
    ),
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
              if (confirm("Are you sure you want to delete this employer?")) {
                const res = await deleteUserAction(row.original.id);
                if (res.success) toast.success("Employer deleted");
                else toast.error(res.error || "Failed to delete employer");
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

export default function AdminEmployersPage() {
  const [data, setData] = useState<EmployerAdmin[]>([]);
  const [loading, setLoading] = useState(true);

  async function fetchData() {
    const supabase = createClient();
    const { data: users, error } = await supabase
      .from("users")
      .select(`
        id, email, full_name, created_at,
        companies (name)
      `)
      .eq("role", "employer")
      .order("created_at", { ascending: false });

    if (users) {
      const formatted = users.map((u: any) => ({
        id: u.id,
        email: u.email,
        full_name: u.full_name,
        companies: Array.isArray(u.companies) 
          ? u.companies.map((c:any) => c.name).join(", ") 
          : (u.companies?.name || "No Company"),
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
          <h1 className="font-heading text-3xl font-extrabold tracking-tight">Employers</h1>
          <p className="text-muted-foreground font-medium mt-1">Manage employer accounts and verifications.</p>
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