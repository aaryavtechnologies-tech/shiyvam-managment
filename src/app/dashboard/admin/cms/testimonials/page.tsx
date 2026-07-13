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
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { createTestimonialAction, updateTestimonialAction, deleteTestimonialAction } from "@/actions/admin/cms";
import { Badge } from "@/components/ui/badge";

type Testimonial = {
  id: string;
  author_name: string;
  author_role: string;
  content: string;
  image_url: string;
  is_active: boolean;
  display_order: number;
};

export default function TestimonialsPage() {
  const [data, setData] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Testimonial | null>(null);

  const [formData, setFormData] = useState({
    author_name: "",
    author_role: "",
    content: "",
    image_url: "",
    is_active: true,
    display_order: 0,
  });

  async function fetchData() {
    setLoading(true);
    const supabase = createClient();
    const { data: items, error } = await supabase.from("testimonials").select("*").order("display_order", { ascending: true });
    if (items) setData(items);
    setLoading(false);
  }

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenModal = (item?: Testimonial) => {
    if (item) {
      setEditingItem(item);
      setFormData({
        author_name: item.author_name,
        author_role: item.author_role,
        content: item.content,
        image_url: item.image_url || "",
        is_active: item.is_active,
        display_order: item.display_order,
      });
    } else {
      setEditingItem(null);
      setFormData({
        author_name: "",
        author_role: "",
        content: "",
        image_url: "",
        is_active: true,
        display_order: 0,
      });
    }
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!formData.author_name || !formData.content) {
      toast.error("Author Name and Content are required");
      return;
    }

    const res = editingItem 
      ? await updateTestimonialAction(editingItem.id, formData)
      : await createTestimonialAction(formData);

    if (res.success) {
      toast.success(`Testimonial ${editingItem ? 'updated' : 'created'}`);
      setModalOpen(false);
      fetchData();
    } else {
      toast.error(res.error || "Failed to save testimonial");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this testimonial?")) return;
    const res = await deleteTestimonialAction(id);
    if (res.success) {
      toast.success("Testimonial deleted");
      fetchData();
    } else {
      toast.error(res.error || "Failed to delete");
    }
  };

  const columns: ColumnDef<Testimonial>[] = [
    {
      accessorKey: "author_name",
      header: "Author",
      cell: ({ row }) => <span className="font-bold">{row.getValue("author_name")}</span>,
    },
    {
      accessorKey: "author_role",
      header: "Role",
    },
    {
      accessorKey: "is_active",
      header: "Status",
      cell: ({ row }) => (
        <Badge variant={row.getValue("is_active") ? "default" : "secondary"}>
          {row.getValue("is_active") ? "Active" : "Inactive"}
        </Badge>
      ),
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
          <h1 className="font-heading text-3xl font-extrabold tracking-tight">Testimonials</h1>
          <p className="text-muted-foreground font-medium">Manage what your clients and candidates say about you.</p>
        </div>
        <Button onClick={() => handleOpenModal()} className="font-bold">
          <Plus className="mr-2 h-4 w-4" /> Add Testimonial
        </Button>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-border p-6">
        <DataTable columns={columns} data={data} searchKey="author_name" />
      </div>

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-xl sm:rounded-3xl">
          <DialogHeader>
            <DialogTitle>{editingItem ? "Edit Testimonial" : "Add Testimonial"}</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Author Name</Label>
                <Input 
                  value={formData.author_name} 
                  onChange={e => setFormData({ ...formData, author_name: e.target.value })} 
                />
              </div>
              <div className="space-y-2">
                <Label>Author Role/Company</Label>
                <Input 
                  value={formData.author_role} 
                  onChange={e => setFormData({ ...formData, author_role: e.target.value })} 
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Profile Image URL</Label>
              <Input 
                value={formData.image_url} 
                onChange={e => setFormData({ ...formData, image_url: e.target.value })} 
              />
            </div>

            <div className="space-y-2">
              <Label>Testimonial Content</Label>
              <Textarea 
                value={formData.content} 
                onChange={e => setFormData({ ...formData, content: e.target.value })}
                className="h-32"
              />
            </div>

            <div className="flex gap-6">
              <div className="flex items-center gap-2">
                <Switch 
                  checked={formData.is_active}
                  onCheckedChange={checked => setFormData({ ...formData, is_active: checked })}
                />
                <Label>Active</Label>
              </div>
              <div className="space-y-2 flex-1">
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
