"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Trash2, Plus } from "lucide-react";
import {toast} from "sonner";

type Testimonial = { id: string; author_name: string; author_role: string; content: string; is_active: boolean };

export default function TestimonialsPage() {
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<Testimonial[]>([]);
  const [form, setForm] = useState({ author_name: "", author_role: "", content: "" });
  const supabase = createClient();

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    setLoading(true);
    const { data } = await (supabase.from("testimonials") as any).select("*").order("created_at", { ascending: false });
    if (data) setItems(data);
    setLoading(false);
  };

  const handleAdd = async () => {
    if (!form.author_name.trim() || !form.content.trim()) return;
    const { error } = await (supabase.from("testimonials") as any).insert([{ ...form, is_active: true }]);
    if (error) toast.error("Failed to add");
    else {
      toast.success("Added successfully");
      setForm({ author_name: "", author_role: "", content: "" });
      fetchItems();
    }
  };

  const handleDelete = async (id: string) => {
    const { error } = await (supabase.from("testimonials") as any).delete().eq("id", id);
    if (error) toast.error("Failed to delete");
    else {
      toast.success("Deleted successfully");
      fetchItems();
    }
  };

  const toggleActive = async (id: string, current: boolean) => {
    const { error } = await (supabase.from("testimonials") as any).update({ is_active: !current }).eq("id", id);
    if (!error) fetchItems();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 font-heading">Testimonials</h1>
          <p className="text-gray-500 text-sm mt-1">Manage client and candidate testimonials.</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Input placeholder="Author Name" value={form.author_name} onChange={(e) => setForm({...form, author_name: e.target.value})} />
          <Input placeholder="Author Role (e.g. CEO, Google)" value={form.author_role} onChange={(e) => setForm({...form, author_role: e.target.value})} />
        </div>
        <Textarea placeholder="Testimonial Content" value={form.content} onChange={(e) => setForm({...form, content: e.target.value})} />
        <Button onClick={handleAdd} className="bg-primary text-white">
          <Plus className="mr-2 h-4 w-4" /> Add Testimonial
        </Button>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        {loading ? (
          <div className="p-8 flex justify-center"><Loader2 className="animate-spin text-primary" size={32} /></div>
        ) : (
          <div className="divide-y divide-gray-100">
            {items.map(item => (
              <div key={item.id} className="py-4 flex items-start justify-between">
                <div>
                  <p className="font-semibold text-gray-900">{item.author_name} <span className="text-gray-500 font-normal text-sm">- {item.author_role}</span></p>
                  <p className="text-gray-600 mt-2 text-sm max-w-2xl">{item.content}</p>
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
            {items.length === 0 && <p className="text-gray-500 text-sm py-4">No testimonials added yet.</p>}
          </div>
        )}
      </div>
    </div>
  );
}
