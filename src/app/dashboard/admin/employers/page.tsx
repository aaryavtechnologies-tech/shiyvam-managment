"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { DataTable, DataTableColumnHeader } from "@/components/ui/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { Trash2, Building, Eye, Edit, ShieldCheck, ShieldAlert, FileText, CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { deleteUserAction } from "@/actions/admin/users";
import { verifyCompanyAction } from "@/actions/admin/employers";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

export type EmployerAdmin = {
  id: string;
  email: string;
  full_name: string;
  company: {
    id: string;
    name: string;
    pan_number: string;
    gst_number: string;
    cin_number: string;
    verification_status: string;
  } | null;
  created_at: string;
};

export default function AdminEmployersPage() {
  const [data, setData] = useState<EmployerAdmin[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEmployer, setSelectedEmployer] = useState<EmployerAdmin | null>(null);

  async function fetchData() {
    const supabase = createClient();
    const { data: users, error } = await supabase
      .from("users")
      .select(`
        id, email, full_name, created_at,
        companies (id, name, pan_number, gst_number, cin_number, verification_status)
      `)
      .eq("role", "employer")
      .order("created_at", { ascending: false });

    if (users) {
      const formatted = users.map((u: any) => ({
        id: u.id,
        email: u.email,
        full_name: u.full_name,
        company: Array.isArray(u.companies) && u.companies.length > 0
          ? u.companies[0]
          : (u.companies || null),
        created_at: u.created_at,
      }));
      setData(formatted);
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchData();
  }, []);

  const handleVerify = async (companyId: string, status: string) => {
    const res = await verifyCompanyAction(companyId, status);
    if (res.success) {
      toast.success(`Company ${status} successfully`);
      fetchData();
      setSelectedEmployer(null);
    } else {
      toast.error(res.error || "Failed to update verification");
    }
  };

  const columns: ColumnDef<EmployerAdmin>[] = [
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
      accessorKey: "company",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Company & Verification" />,
      cell: ({ row }) => {
        const comp = row.original.company;
        if (!comp) return <span className="text-muted-foreground text-sm">No Company</span>;
        
        return (
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-1.5 font-bold">
              <Building size={14} className="text-primary" />
              {comp.name}
            </div>
            <div>
              {comp.verification_status === 'verified' ? (
                <Badge className="bg-green-100 text-green-700 hover:bg-green-100 shadow-none"><ShieldCheck size={12} className="mr-1"/> Verified</Badge>
              ) : comp.verification_status === 'rejected' ? (
                <Badge className="bg-red-100 text-red-700 hover:bg-red-100 shadow-none"><ShieldAlert size={12} className="mr-1"/> Rejected</Badge>
              ) : (
                <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100 shadow-none"><FileText size={12} className="mr-1"/> Pending</Badge>
              )}
            </div>
          </div>
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
              variant="outline" 
              size="sm" 
              className="text-blue-600 border-blue-200 bg-blue-50 hover:bg-blue-100 font-bold"
              onClick={() => setSelectedEmployer(row.original)}
            >
              <ShieldCheck size={16} className="mr-1" />
              Verify
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

      <Dialog open={!!selectedEmployer} onOpenChange={(open) => !open && setSelectedEmployer(null)}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="font-heading text-2xl font-bold">Employer Verification</DialogTitle>
            <DialogDescription>
              Review the company details and legal documents before approving.
            </DialogDescription>
          </DialogHeader>
          
          {selectedEmployer && selectedEmployer.company ? (
            <div className="space-y-6 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm font-bold text-muted-foreground">Employer Name</p>
                  <p className="font-semibold">{selectedEmployer.full_name}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-bold text-muted-foreground">Email</p>
                  <p className="font-semibold">{selectedEmployer.email}</p>
                </div>
                <div className="space-y-1 col-span-2">
                  <p className="text-sm font-bold text-muted-foreground">Company Name</p>
                  <p className="font-semibold text-lg">{selectedEmployer.company.name}</p>
                </div>
              </div>

              <div className="border-t-2 border-border pt-4 grid grid-cols-2 gap-6 bg-muted/30 rounded-xl p-4">
                <div>
                  <p className="text-sm font-bold text-muted-foreground mb-1">PAN Number</p>
                  <p className="font-bold font-mono tracking-wider">{selectedEmployer.company.pan_number || "Not provided"}</p>
                </div>
                <div>
                  <p className="text-sm font-bold text-muted-foreground mb-1">GST Number</p>
                  <p className="font-bold font-mono tracking-wider">{selectedEmployer.company.gst_number || "Not provided"}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm font-bold text-muted-foreground mb-1">CIN (Corporate Identity Number)</p>
                  <p className="font-bold font-mono tracking-wider">{selectedEmployer.company.cin_number || "Not provided"}</p>
                </div>
              </div>

              <div className="flex gap-3 justify-end pt-4">
                <Button 
                  variant="outline" 
                  className="border-red-200 bg-red-50 text-red-700 hover:bg-red-100 font-bold"
                  onClick={() => handleVerify(selectedEmployer.company!.id, 'rejected')}
                >
                  <XCircle size={16} className="mr-2" />
                  Reject
                </Button>
                <Button 
                  className="bg-green-600 hover:bg-green-700 text-white font-bold"
                  onClick={() => handleVerify(selectedEmployer.company!.id, 'verified')}
                >
                  <CheckCircle2 size={16} className="mr-2" />
                  Approve Company
                </Button>
              </div>
            </div>
          ) : (
            <div className="py-8 text-center text-muted-foreground font-medium">
              This employer has not created a company profile yet.
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}