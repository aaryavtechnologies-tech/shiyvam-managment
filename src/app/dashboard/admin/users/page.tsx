"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { DataTable, DataTableColumnHeader } from "@/components/ui/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { Trash2, Shield, User, Building } from "lucide-react";
import { Button } from "@/components/ui/button";
import { deleteUserAction } from "@/actions/admin/users";
import { toast } from "sonner";

export type UserAdmin = {
  id: string;
  email: string;
  role: string;
  created_at: string;
};

export const columns: ColumnDef<UserAdmin>[] = [
  {
    accessorKey: "email",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Email" />,
    cell: ({ row }) => (
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">
          {(row.getValue("email") as string).charAt(0).toUpperCase()}
        </div>
        <span className="font-bold">{row.getValue("email")}</span>
      </div>
    ),
  },
  {
    accessorKey: "role",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Role" />,
    cell: ({ row }) => {
      const role = row.getValue("role") as string;
      const Icon = role === "admin" ? Shield : role === "employer" ? Building : User;
      const colorClass = 
        role === "admin" ? "bg-purple-50 text-purple-700 border-purple-200" :
        role === "employer" ? "bg-blue-50 text-blue-700 border-blue-200" :
        "bg-green-50 text-green-700 border-green-200";

      return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold border-2 capitalize \${colorClass}`}>
          <Icon size={12} /> {role}
        </span>
      );
    },
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
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
            onClick={async () => {
              if (confirm("Are you sure you want to delete this user?")) {
                const res = await deleteUserAction(row.original.id);
                if (res.success) {
                  toast.success("User deleted");
                  // Optional: trigger refresh by callback
                } else {
                  toast.error(res.error || "Failed to delete user");
                }
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

export default function AdminUsersPage() {
  const [data, setData] = useState<UserAdmin[]>([]);
  const [loading, setLoading] = useState(true);

  async function fetchData() {
    const supabase = createClient();
    const { data: users, error } = await supabase
      .from("users")
      .select("id, email, role, created_at")
      .order("created_at", { ascending: false });

    if (users) {
      setData(users as UserAdmin[]);
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
          <h1 className="font-heading text-3xl font-extrabold tracking-tight">User Management</h1>
          <p className="text-muted-foreground font-medium mt-1">Manage candidates, employers, and administrators.</p>
        </div>
        <Button className="border border-border shadow-sm font-bold bg-primary text-primary-foreground hover:bg-primary/90">
          Invite User
        </Button>
      </div>

      {loading ? (
        <div className="h-64 flex items-center justify-center bg-white border-2 border-border rounded-[2rem] shadow-sm">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : (
        <DataTable columns={columns} data={data} searchKey="email" />
      )}
    </div>
  );
}
