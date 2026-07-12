"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Trash2, Plus } from "lucide-react";
import {toast} from "sonner"

type Company = { id: string; name: string; is_active: boolean };

export default function CompaniesPage() {
  const [loading, setLoading] = useState(true);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [newName, setNewName] = useState("");
  const supabase = createClient();

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    setLoading(true);
    const { data } = await (supabase.from("trusted_companies") as any).select("*").order("created_at", { ascending: false });
    if (data) setCompanies(data);
    setLoading(false);
  };

  const handleAdd = async () => {
    if (!newName.trim()) return;
    const { error } = await (supabase.from("trusted_companies") as any).insert([{ name: newName, is_active: true }]);
    if (error) toast.error("Failed to add company");
    else {
      toast.success("Added successfully");
      setNewName("");
      fetchCompanies();
    }
  };

  const handleDelete = async (id: string) => {
    const { error } = await (supabase.from("trusted_companies") as any).delete().eq("id", id);
    if (error) toast.error("Failed to delete");
    else {
      toast.success("Deleted successfully");
      fetchCompanies();
    }
  };

  const toggleActive = async (id: string, current: boolean) => {
    const { error } = await (supabase.from("trusted_companies") as any).update({ is_active: !current }).eq("id", id);
    if (!error) fetchCompanies();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 font-heading">Trusted Companies</h1>
          <p className="text-gray-500 text-sm mt-1">Manage the companies displayed in the "Trusted By" section.</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-6">
        <div className="flex gap-4">
          <Input 
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Company Name (e.g. Goldman Sachs)"
            className="max-w-xs"
          />
          <Button onClick={handleAdd} className="bg-primary text-white">
            <Plus className="mr-2 h-4 w-4" /> Add Company
          </Button>
        </div>

        {loading ? (
          <div className="p-8 flex justify-center"><Loader2 className="animate-spin text-primary" size={32} /></div>
        ) : (
          <div className="divide-y divide-gray-100">
            {companies.map(c => (
              <div key={c.id} className="py-4 flex items-center justify-between">
                <div>
                  <p className="font-semibold text-gray-900">{c.name}</p>
                </div>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 text-sm cursor-pointer">
                    <input type="checkbox" checked={c.is_active} onChange={() => toggleActive(c.id, c.is_active)} className="rounded text-primary focus:ring-primary" />
                    Active
                  </label>
                  <Button variant="ghost" size="sm" onClick={() => handleDelete(c.id)} className="text-red-500 hover:text-red-700 hover:bg-red-50">
                    <Trash2 size={16} />
                  </Button>
                </div>
              </div>
            ))}
            {companies.length === 0 && <p className="text-gray-500 text-sm py-4">No companies added yet.</p>}
          </div>
        )}
      </div>
    </div>
  );
}
