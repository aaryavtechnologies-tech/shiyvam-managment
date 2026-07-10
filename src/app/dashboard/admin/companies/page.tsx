"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { DataTable, DataTableColumnHeader } from "@/components/ui/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { Eye, Edit, Building, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";

export type CompanyAdmin = {
  id: string;
  name: string;
  logo_url: string;
  industry: string;
  jobs: number;
  created_at: string;
};

export const columns: ColumnDef<CompanyAdmin>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Company Name" />,
    cell: ({ row }) => (
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl border-2 border-border overflow-hidden bg-muted flex-shrink-0 flex items-center justify-center font-bold text-muted-foreground">
          {row.original.logo_url ? (
            <img src={row.original.logo_url} alt={row.original.name} className="w-full h-full object-cover" />
          ) : (
            row.original.name.charAt(0) || "C"
          )}
        </div>
        <span className="font-bold text-base">{row.getValue("name")}</span>
      </div>
    ),
  },
  {
    accessorKey: "industry",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Industry" />,
    cell: ({ row }) => (
      <span className="font-medium">{row.getValue("industry") || "Unspecified"}</span>
    )
  },
  {
    accessorKey: "jobs",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Active Jobs" />,
    cell: ({ row }) => {
      const jobs = row.getValue("jobs") as number;
      return (
        <div className="flex items-center gap-1.5 font-bold">
          <Briefcase size={14} className="text-muted-foreground" />
          {jobs}
        </div>
      );
    }
  },
  {
    accessorKey: "created_at",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Registered" />,
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
          <Button variant="ghost" size="icon" className="h-8 w-8 text-amber-600 hover:text-amber-700 hover:bg-amber-50">
            <Edit size={16} />
          </Button>
        </div>
      );
    },
  },
];

export default function AdminCompaniesPage() {
  const [data, setData] = useState<CompanyAdmin[]>([]);
  const [loading, setLoading] = useState(true);

  async function fetchData() {
    const supabase = createClient();
    const { data: companies, error } = await supabase
      .from("companies")
      .select(`
        id, name, logo_url, industry, created_at,
        jobs (id)
      `)
      .order("created_at", { ascending: false });

    if (companies) {
      const formatted = companies.map((c: any) => ({
        id: c.id,
        name: c.name,
        logo_url: c.logo_url,
        industry: c.industry,
        jobs: c.jobs ? c.jobs.length : 0,
        created_at: c.created_at,
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
          <h1 className="font-heading text-3xl font-extrabold tracking-tight">Companies</h1>
          <p className="text-muted-foreground font-medium mt-1">Manage company profiles and verify businesses.</p>
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
        <DataTable columns={columns} data={data} searchKey="name" />
      )}
    </div>
  );
}
