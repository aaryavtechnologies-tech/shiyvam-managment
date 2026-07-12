"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { DataTable, DataTableColumnHeader } from "@/components/ui/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";

export type AuditLog = {
  id: string;
  action: string;
  target_type: string;
  admin_email: string;
  created_at: string;
  details: string;
};

export default function AuditLogsPage() {
  const [data, setData] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);

  async function fetchData() {
    setLoading(true);
    const supabase = createClient();
    
    // Fetch logs and join with users to get the email of the person who did the action
    const { data: logs, error } = await supabase
      .from("audit_logs")
      .select(`
        id, action, target_type, created_at, old_data, new_data,
        users (email)
      `)
      .order("created_at", { ascending: false })
      .limit(100);

    if (logs) {
      const formatted = logs.map((log: any) => ({
        id: log.id,
        action: log.action,
        target_type: log.target_type,
        admin_email: log.users ? log.users.email : "System/Unknown",
        created_at: log.created_at,
        details: log.new_data ? JSON.stringify(log.new_data) : log.old_data ? JSON.stringify(log.old_data) : "No details",
      }));
      setData(formatted);
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchData();
  }, []);

  const columns: ColumnDef<AuditLog>[] = [
    {
      accessorKey: "created_at",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Timestamp" />,
      cell: ({ row }) => format(new Date(row.getValue("created_at")), "PPpp"),
    },
    {
      accessorKey: "admin_email",
      header: ({ column }) => <DataTableColumnHeader column={column} title="User" />,
      cell: ({ row }) => <span className="font-medium">{row.getValue("admin_email")}</span>,
    },
    {
      accessorKey: "action",
      header: "Action",
      cell: ({ row }) => {
        const action = row.getValue("action") as string;
        return (
          <Badge variant="outline" className={`capitalize \${
            action === 'login' ? 'border-blue-300 text-blue-700 bg-blue-50' :
            action === 'approve' ? 'border-green-300 text-green-700 bg-green-50' :
            action === 'reject' || action === 'delete' ? 'border-red-300 text-red-700 bg-red-50' : 
            'border-amber-300 text-amber-700 bg-amber-50'
          }`}>
            {action}
          </Badge>
        );
      }
    },
    {
      accessorKey: "target_type",
      header: "Target",
      cell: ({ row }) => <span className="capitalize font-bold text-muted-foreground">{row.getValue("target_type")}</span>,
    },
    {
      accessorKey: "details",
      header: "Details",
      cell: ({ row }) => (
        <span className="text-xs text-muted-foreground font-mono truncate max-w-[200px] inline-block">
          {row.getValue("details")}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="font-heading text-3xl font-extrabold tracking-tight">Audit Logs</h1>
          <p className="text-muted-foreground font-medium mt-1">Track all critical actions performed on the platform.</p>
        </div>
      </div>

      {loading ? (
        <div className="h-64 flex items-center justify-center bg-white border-2 border-border rounded-[2rem] shadow-sm">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : (
        <DataTable columns={columns} data={data} searchKey="admin_email" />
      )}
    </div>
  );
}
