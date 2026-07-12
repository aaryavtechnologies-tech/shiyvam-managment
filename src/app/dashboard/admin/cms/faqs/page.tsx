"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { DataTable, DataTableColumnHeader } from "@/components/ui/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { createFaqAction, updateFaqAction, deleteFaqAction } from "@/actions/admin/cms";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

type FAQ = {
  id: string;
  question: string;
  answer: string;
  category: string;
  display_order: number;
};

export default function FAQsPage() {
  const [data, setData] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<FAQ | null>(null);

  const [formData, setFormData] = useState({
    question: "",
    answer: "",
    category: "general",
    display_order: 0,
  });

  async function fetchData() {
    setLoading(true);
    const supabase = createClient();
    const { data: items, error } = await supabase.from("faq").select("*").order("display_order", { ascending: true });
    if (items) setData(items);
    setLoading(false);
  }

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenModal = (item?: FAQ) => {
    if (item) {
      setEditingItem(item);
      setFormData({
        question: item.question,
        answer: item.answer,
        category: item.category,
        display_order: item.display_order,
      });
    } else {
      setEditingItem(null);
      setFormData({
        question: "",
        answer: "",
        category: "general",
        display_order: 0,
      });
    }
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!formData.question || !formData.answer) {
      toast.error("Question and Answer are required");
      return;
    }

    const res = editingItem 
      ? await updateFaqAction(editingItem.id, formData)
      : await createFaqAction(formData);

    if (res.success) {
      toast.success(\`FAQ \${editingItem ? 'updated' : 'created'}\`);
      setModalOpen(false);
      fetchData();
    } else {
      toast.error(res.error || "Failed to save FAQ");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this FAQ?")) return;
    const res = await deleteFaqAction(id);
    if (res.success) {
      toast.success("FAQ deleted");
      fetchData();
    } else {
      toast.error(res.error || "Failed to delete");
    }
  };

  const columns: ColumnDef<FAQ>[] = [
    {
      accessorKey: "question",
      header: "Question",
      cell: ({ row }) => <span className="font-bold">{row.getValue("question")}</span>,
    },
    {
      accessorKey: "category",
      header: "Category",
      cell: ({ row }) => <Badge variant="outline" className="capitalize">{row.getValue("category")}</Badge>,
    },
    {
      accessorKey: "display_order",
      header: "Order",
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => handleOpenModal(row.original)}>
            <Edit className="w-4 h-4 text-muted-foreground" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => handleDelete(row.original.id)}>
            <Trash2 className="w-4 h-4 text-destructive" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="font-heading text-3xl font-extrabold tracking-tight">FAQs</h1>
          <p className="text-muted-foreground font-medium">Manage frequently asked questions.</p>
        </div>
        <Button onClick={() => handleOpenModal()} className="font-bold">
          <Plus className="mr-2 h-4 w-4" /> Add FAQ
        </Button>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-border p-6">
        <DataTable columns={columns} data={data} searchKey="question" />
      </div>

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-xl sm:rounded-3xl">
          <DialogHeader>
            <DialogTitle>{editingItem ? "Edit FAQ" : "Add FAQ"}</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Question</Label>
              <Input 
                value={formData.question} 
                onChange={e => setFormData({ ...formData, question: e.target.value })} 
              />
            </div>
            
            <div className="space-y-2">
              <Label>Answer</Label>
              <Textarea 
                value={formData.answer} 
                onChange={e => setFormData({ ...formData, answer: e.target.value })}
                className="h-32"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Category</Label>
                <Select value={formData.category} onValueChange={val => setFormData({ ...formData, category: val })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="general">General</SelectItem>
                    <SelectItem value="employers">Employers</SelectItem>
                    <SelectItem value="candidates">Candidates</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Display Order</Label>
                <Input 
                  type="number"
                  value={formData.display_order} 
                  onChange={e => setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })} 
                />
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button onClick={handleSave}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
