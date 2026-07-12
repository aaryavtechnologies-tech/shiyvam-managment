"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Trash2, Plus } from "lucide-react";
import {toast} from "sonner";

type Story = { id: string; candidate_name: string; previous_role: string; new_role: string; company: string; salary_hike: string; is_active: boolean };

export default function SuccessStoriesPage() {
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<Story[]>([]);
  const [form, setForm] = useState({ candidate_name: "", previous_role: "", new_role: "", company: "", salary_hike: "" });
  const supabase = createClient();

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    setLoading(true);
    const { data } = await (supabase.from("success_stories") as any).select("*").order("created_at", { ascending: false });
    if (data) setItems(data);
    setLoading(false);
  };

  const handleAdd = async () => {
    if (!form.candidate_name.trim()) return;
    const { error } = await (supabase.from("success_stories") as any).insert([{ ...form, is_active: true }]);
    if (error) toast.error("Failed to add");
    else {
      toast.success("Added successfully");
      setForm({ candidate_name: "", previous_role: "", new_role: "", company: "", salary_hike: "" });
      fetchItems();
    }
  };

  const handleDelete = async (id: string) => {
    const { error } = await (supabase.from("success_stories") as any).delete().eq("id", id);
    if (error) toast.error("Failed to delete");
    else {
      toast.success("Deleted successfully");
      fetchItems();
    }
  };

  const toggleActive = async (id: string, current: boolean) => {
    const { error } = await (supabase.from("success_stories") as any).update({ is_active: !current }).eq("id", id);
    if (!error) fetchItems();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 font-heading">Success Stories</h1>
          <p className="text-gray-500 text-sm mt-1">Manage candidate success and salary transformations.</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <Input placeholder="Candidate Name" value={form.candidate_name} onChange={(e) => setForm({...form, candidate_name: e.target.value})} />
          <Input placeholder="Previous Role" value={form.previous_role} onChange={(e) => setForm({...form, previous_role: e.target.value})} />
          <Input placeholder="New Role" value={form.new_role} onChange={(e) => setForm({...form, new_role: e.target.value})} />
          <Input placeholder="Company" value={form.company} onChange={(e) => setForm({...form, company: e.target.value})} />
          <Input placeholder="Salary Hike (e.g. 50%)" value={form.salary_hike} onChange={(e) => setForm({...form, salary_hike: e.target.value})} />
        </div>
        <Button onClick={handleAdd} className="bg-primary text-white mt-2">
          <Plus className="mr-2 h-4 w-4" /> Add Story
        </Button>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        {loading ? (
          <div className="p-8 flex justify-center"><Loader2 className="animate-spin text-primary" size={32} /></div>
        ) : (
          <div className="divide-y divide-gray-100">
            {items.map(item => (
              <div key={item.id} className="py-4 flex items-center justify-between">
                <div>
                  <p className="font-semibold text-gray-900">{item.candidate_name} <span className="text-primary ml-2 font-bold">{item.salary_hike} Hike</span></p>
                  <p className="text-gray-500 text-sm mt-1">
                    {item.previous_role} &rarr; {item.new_role} at {item.company}
                  </p>
                </div>
                <div className="flex items-center gap-4 shrink-0 ml-4">
                  <label className="flex items-center gap-2 text-sm cursor-pointer">
                    <input type="checkbox" checked={item.is_active} onChange={() => toggleActive(item.id, item.is_active)} className="rounded text-primary focus:ring-primary" />
                    Active
                  </label>
                  <Button variant="ghost" size="sm" onClick={() => handleDelete(item.id)} className="text-red-500 hover:text-red-700 hover:bg-red-50">
                    <Trash2 size={16} />
                  </Button>
                </div>
              </div>
            ))}
            {items.length === 0 && <p className="text-gray-500 text-sm py-4">No stories added yet.</p>}
          </div>
        )}
      </div>
    </div>
  );
}
